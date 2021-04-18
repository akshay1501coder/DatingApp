using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IUnitOfWork _unitOfWork;
        public UsersController(IUnitOfWork unitOfWork, IMapper mapper,
        IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var gender = await _unitOfWork.UserRepository.GetUserGender(User.GetUserName());
            userParams.CurrentUserName = User.GetUserName();

            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = gender == "male" ? "female" : "male";
            }

            var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);

            //Custome Extention method for HttpResponse
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize
                    , users.TotalCount, users.TotalPages);
            return Ok(users);
        }

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var user = await _unitOfWork.UserRepository.GetMemberAsync(username);

            return user;
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult<MemberDto>> GetUser(int id)
        {
            var user = await _unitOfWork.UserRepository.GetMemberByIdAsync(id);

            return user;
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            /*below line will make use of the claim (username and token) which is being used by the API
            , to authenticate the user and get username from that*/

            var username = User.GetUserName(); //Extension method
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            // user.Interest = memberUpdateDto.Interest;
            // user.Introduction = memberUpdateDto.Introduction;

            //In order to assign objects one by one(as above) we use map instead
            _mapper.Map(memberUpdateDto, user);

            _unitOfWork.UserRepository.UpdateProfile(user);

            if (await _unitOfWork.Complete())
            {
                return NoContent();
            }
            else
            {
                return BadRequest("Failed to update user");
            }
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var username = User.GetUserName();
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);

            if (await _unitOfWork.Complete())
            {
                //return _mapper.Map<PhotoDto>(photo);
                //this will return status 200 (ok)
                //but when we create something we have to send status 201(created) 

                return CreatedAtAction("GetUser", new { username = user.UserName },
                 _mapper.Map<PhotoDto>(photo));
            }
            else
            {
                return BadRequest("Problem adding photo");
            }
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var users = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

            var photo = users.Photos.FirstOrDefault(m => m.Id == photoId);

            if (photo.IsMain)
            {
                return BadRequest("This is already your main photo");
            }
            var currentMain = users.Photos.FirstOrDefault(m => m.IsMain);
            if (currentMain != null)
            {
                currentMain.IsMain = false;
            }
            photo.IsMain = true;

            if (await _unitOfWork.Complete())
            {
                return NoContent();
            }
            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{PhotoId}")]
        public async Task<ActionResult> DeletePhoto(int PhotoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

            var photo = user.Photos.FirstOrDefault(m => m.Id == PhotoId);

            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("You cannot delete main photo");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);
            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to delete the photo");
        }
    }
}
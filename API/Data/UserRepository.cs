using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        //Injecting DataContext in UserRepository
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
            .Include(p => p.Photos).ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync
            (m => m.UserName == username);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void UpdateProfile(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        //IEnumerable earlier
        public async Task<PagedList<MemberDto>> GetMembersAsync(PagerParams pagerParams)
        {
            // return await _context.Users
            // .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            // .ToListAsync();

            //Below line is Queryable, i.e.. its just a query unless we prove tolist or other
            var query = _context.Users.AsQueryable();

            var minDob = DateTime.Today.AddYears(-pagerParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-pagerParams.MinAge);

            query = query
                .Where(m => (m.UserName != pagerParams.CurrentUserName)
                && (m.Gender == pagerParams.Gender));

            query = query.Where(m => m.DateOfBirth >= minDob && m.DateOfBirth <= maxDob);
            
            query = pagerParams.OrderBy switch
            {
                "created" => query.OrderByDescending(m=>m.Created),
                _ => query.OrderByDescending(m=>m.LastActive)
            };
            
            // query = query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            // .AsNoTracking();

            // var query = _context.Users
            // .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            // .AsNoTracking();

            return await PagedList<MemberDto>.CreateAsync
            (query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            , pagerParams.pageNumber, pagerParams.pageSize);
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users
            .Where(x => x.UserName == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
            //_mapper.ConfigurationProvider : this configuration is picked from AutoMapperProfiles.cs
        }

        public async Task<MemberDto> GetMemberByIdAsync(int id)
        {
            return await _context.Users
            .Where(m => m.Id == id)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
        }
    }
}
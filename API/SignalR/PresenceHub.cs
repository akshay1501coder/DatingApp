using System;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    /*Signal R cannot send response in Application header so we need to  
    send response using query string
    */
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var isOnline = await _tracker.UserConnected(Context.User.GetUserName(), Context.ConnectionId);

            if (isOnline)
            {
                await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUserName());
            }
            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
            //above Clients.All will send to all the available users
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var isOffline = await _tracker.UserDisconnected(Context.User.GetUserName(), Context.ConnectionId);
            if (isOffline)
            {
                await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUserName());
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
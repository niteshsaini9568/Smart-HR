import { Bell, Settings, LogOut, User, Menu, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

const notificationIcons = {
  success: { icon: CheckCircle2, className: 'text-emerald-400 bg-emerald-500/15' },
  error: { icon: AlertCircle, className: 'text-red-400 bg-red-500/15' },
  warning: { icon: AlertTriangle, className: 'text-amber-400 bg-amber-500/15' },
  info: { icon: Info, className: 'text-blue-400 bg-blue-500/15' },
};

export default function TopNav({
  user,
  onMenuClick,
  onProfileClick,
  onSettingsClick,
  notifications = [],
  onNotificationClick,
  onViewAllNotifications,
  onMarkAllRead,
}) {
  const { logout } = useAuth();
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const userAvatar = user?.avatar && user.avatar !== 'default-avatar.png'
    ? `${user.avatar}${user.avatar.includes('?') ? '&' : '?'}t=${user?.updatedAt || Date.now()}`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || 'User'}`;

  const displayName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-muted-foreground">Welcome back</p>
            <p className="text-sm font-display font-semibold text-foreground truncate max-w-[200px] lg:max-w-none">
              {displayName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <DropdownMenu open={notificationDropdownOpen} onOpenChange={setNotificationDropdownOpen}>
            <DropdownMenuTrigger className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center p-0 bg-blue-600 text-white border-2 border-background text-[10px]">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-display font-semibold text-sm">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && onMarkAllRead && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-xs text-muted-foreground hover:text-accent transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && onViewAllNotifications && (
                    <button
                      onClick={() => {
                        onViewAllNotifications();
                        setNotificationDropdownOpen(false);
                      }}
                      className="text-xs text-accent hover:text-accent/80 font-medium transition-colors"
                    >
                      View all
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => {
                    const config = notificationIcons[notification.type] || notificationIcons.info;
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={notification.id}
                        whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                        onClick={() => {
                          onNotificationClick?.(notification);
                          setNotificationDropdownOpen(false);
                        }}
                        className={`flex items-start gap-3 p-3 cursor-pointer border-b last:border-0 ${
                          !notification.read ? 'bg-accent/5' : ''
                        }`}
                      >
                        <div className={`flex-shrink-0 rounded-lg p-1.5 ${config.className}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${!notification.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5" />
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
              <Avatar className="h-8 w-8 ring-2 ring-border">
                <AvatarImage src={userAvatar} alt={displayName} />
                <AvatarFallback className="bg-accent/10 text-accent text-xs font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium text-foreground max-w-[120px] truncate">
                {displayName}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground font-normal truncate">{user?.email || ''}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

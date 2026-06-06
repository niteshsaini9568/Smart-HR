import { useState } from 'react';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import ProfileDialog from '../profile/ProfileDialog';
import { PageTransition } from '../shared/AnimatedTypography';

export default function DashboardLayout({
  children,
  user,
  sidebarItems,
  theme = 'blue',
  onSettingsClick,
  notifications = [],
  onNotificationClick,
  onViewAllNotifications,
  onMarkAllRead,
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex h-screen bg-background overflow-hidden grid-bg">
      <Sidebar
        items={sidebarItems}
        theme={theme}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopNav
          user={user}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          onProfileClick={() => setIsProfileDialogOpen(true)}
          onSettingsClick={onSettingsClick}
          notifications={notifications}
          onNotificationClick={onNotificationClick}
          onViewAllNotifications={onViewAllNotifications}
          onMarkAllRead={onMarkAllRead}
        />
        <main className="flex-1 overflow-y-auto">
          <PageTransition className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            {children}
          </PageTransition>
        </main>
      </div>

      <ProfileDialog
        isOpen={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
      />
    </div>
  );
}

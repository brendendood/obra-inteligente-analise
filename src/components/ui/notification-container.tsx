
import { createPortal } from 'react-dom';
import { EnhancedNotification, useEnhancedNotifications } from './enhanced-notification';

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useEnhancedNotifications();

  if (notifications.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md pointer-events-none">
      {notifications.slice(0, 3).map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <EnhancedNotification
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

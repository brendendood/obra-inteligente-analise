
import { createPortal } from 'react-dom';
import { EnhancedNotification, useEnhancedNotifications } from './enhanced-notification';

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useEnhancedNotifications();

  if (notifications.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <EnhancedNotification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>,
    document.body
  );
};

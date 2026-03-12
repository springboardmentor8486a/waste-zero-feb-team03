import Notification from '../models/Notification.js';

/* =====================================
   GET /notifications
===================================== */
export const getNotifications = async (req, res, next) => {
  try {
    const filter = { user_id: req.user._id };
    if (req.query.unread === 'true') filter.read = false;

    const limit = Math.min(100, parseInt(req.query.limit) || 20);

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ sent_at: -1 }).limit(limit).lean(),
      Notification.countDocuments({ user_id: req.user._id, read: false }),
    ]);

    res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

/* =====================================
   PATCH /notifications/:id/read
===================================== */
export const markOneRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

/* =====================================
   PATCH /notifications/read-all
===================================== */
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user_id: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

/* =====================================
   DELETE /notifications/:id
===================================== */
export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};
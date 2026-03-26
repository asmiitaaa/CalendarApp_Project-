const db = require("../db");

//route get/api/admin/users
//private access

const getAllUsers = async (req, res) => {
  try {
    //get all users with their events using group by
    //SQL QUERY
    const [results] = await db
      .promise()
      .query(
        "select u.user_id, u.name, u.email,u.is_active, u.created_at, count(e.event_id) as total_events from users u left join events e on u.user_id=e.creator_id group by u.user_id",
      );
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route   GET /api/admin/audit-logs
// @access  Private
const getAuditLogs = async (req, res) => {
  try {
    // get all audit logs with user and event details
    const [results] = await db
      .promise()
      .query(
        "select al.*, u.name as performed_by_name, e.title as event_title from audit_logs al join users u on al.performed_by=u.user_id join events e on al.event_id=e.event_id order by al.action_timestamp desc",
      );

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route   DELETE /api/admin/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // check if user exists using IN
    const [user] = await db
      .promise()
      .query(
        "select * from users where user_id in (select user_id from users where user_id=?)",
        [id],
      );

    if (user.length === 0)
      return res.status(404).json({ message: "user not found" });

    // delete the user
    await db.promise().query("delete from users where user_id=?", [id]);

    res.json({ message: "user deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getAuditLogs, deleteUser };

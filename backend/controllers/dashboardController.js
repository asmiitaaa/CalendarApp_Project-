const db = require("../db");

//route get/api/dashboard/stats
//access is private access

const getDashboardStats = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    //total events for the logged in user
    //SQL QUERY
    const [totalEvents] = await db
      .promise()
      .query(
        "select count(*) as total_events from events where event_id in(select event_id from event_participants where user_id=?)",
        [user_id],
      );
    //to find the number of pending invites for the logged-in user
    const [pendingInvites] = await db
      .promise()
      .query(
        "select count(*) as pending_invites from event_participants where user_id=? and status=?",
        [user_id, "invited"],
      );

    //to find number of recurring events for the logged in user
    //SQL QUERY
    const [recurringEvents] = await db
      .promise()
      .query(
        "select count(*) as recurring_events from events where is_recurring=true and event_id in (select event_id from event_participants where user_id=?)",
        [user_id],
      );

    //events grouped by visibility using group by
    const [eventsByVisibility] = await db
      .promise()
      .query(
        "select visibility, count(*) as total from events where event_id in (select event_id from event_participants where user_id=?) group by visibility",
        [user_id],
      );

    res.json({
      total_events: totalEvents[0].total_events,
      pending_invites: pendingInvites[0].pending_invites,
      recurring_events: recurringEvents[0].recurring_events,
      events_by_visibility: eventsByVisibility,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats };

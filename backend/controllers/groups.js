import Group from '../models/Group.js';
import User from '../models/User.js';
import sendEmail from '../utils/email.js';

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !members || !Array.isArray(members)) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const group = await Group.create({
      name,
      createdBy: req.user._id,
      shortId: Math.random().toString(36).substring(2, 8),
      members: [{ user: req.user._id }]
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id }
    });

    for (const email of members) {
      const existing = await User.findOne({ email: email.toLowerCase() });

      const link = existing
        ? `${process.env.FRONTEND_URL}/groups/${group.shortId}/join`
        : `${process.env.FRONTEND_URL}/signup?invite=${group.shortId}`;

      await sendEmail({
        to: email,
        subject: `You're invited to join ${name}`,
        html: `
          <p>You've been invited to join <strong>${name}</strong></p>
          <p><a href="${link}">Click here to join the group</a></p>
          <p>This link expires in 7 days.</p>
        `
      });
    }

    res.status(201).json({ success: true, group });
  } catch (err) {
    console.error('Create group error:', err);
    res.status(500).json({ success: false, message: 'Failed to create group' });
  }
};

export const inviteMember = async (req, res, next) => {
  try {
    const group = await Group.findOne({
      _id: req.params.groupId,
      'members.user': req.user.id
    }).populate('createdBy', 'name email');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found or unauthorized'
      });
    }

    const { email } = req.body;
    const invitee = await User.findOne({ email: email.toLowerCase() });

    const invitationLink = invitee
      ? `${process.env.FRONTEND_URL}/groups/${group.shortId}/join`
      : `${process.env.FRONTEND_URL}/signup?invite=${group.shortId}`;

    await sendEmail({
      email,
      subject: `Invitation to join ${group.name}`,
      html: `
        <p>You've been invited to join <strong>${group.name}</strong></p>
        <p>Created by: ${group.createdBy.name} (${group.createdBy.email})</p>
        <p>Click here to accept: <a href="${invitationLink}">Join Group</a></p>
        <p>This link expires in 7 days.</p>
      `
    });

    res.json({ success: true, message: `Invitation sent to ${email}` });
  } catch (err) {
    next(err);
  }
};

export const joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findOne({ shortId: req.params.shortId });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invitation link'
      });
    }

    const isMember = group.members.some(m => m.user.equals(req.user.id));
    if (isMember) {
      return res.status(409).json({
        success: false,
        message: 'Already a group member'
      });
    }

    group.members.push({ user: req.user.id, joinedAt: Date.now() });
    await group.save();

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { groups: group._id }
    });

    res.json({
      success: true,
      message: `Joined ${group.name} successfully`,
      groupId: group._id
    });
  } catch (err) {
    next(err);
  }
};

export const addExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { title, amount, paidBy, splitBetween } = req.body;

    const group = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          expenses: {
            title,
            amount,
            paidBy,
            splitBetween,
            date: new Date()
          }
        }
      },
      { new: true }
    ).populate('expenses.paidBy', 'name')
     .populate('expenses.splitBetween', 'name');

    res.json(group.expenses[group.expenses.length - 1]); // Send back only the new expense
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ 'members.user': req.user._id })
      .populate('members.user', 'name email')
      .populate('expenses.paidBy', 'name')
      .populate('expenses.splitBetween', 'name');
    res.json(groups);
  } catch (err) {
    console.error('getUserGroups error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

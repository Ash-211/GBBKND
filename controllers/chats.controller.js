const chatService = require('../services/chatService');

/**
 * Creates a new chat group.
 * Expects request body: { groupName: String, creatorId: String, members: [userId, ...] }
 * Only allows adding users that are matched with the creator.
 */
exports.createGroup = async (req, res) => {
  try {
    const { groupName, creatorId, members } = req.body;
    const group = await chatService.createGroup(groupName, creatorId, members);
    res.status(201).json({
      message: 'Chat group created successfully',
      group
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Adds a member to an existing chat group.
 * Expects request body: { groupId: String, newMemberId: String, creatorId: String }
 * Verifies that the new member is matched with the group creator.
 */
exports.addMember = async (req, res) => {
  try {
    const { groupId, newMemberId, creatorId } = req.body;
    const group = await chatService.addMember(groupId, newMemberId, creatorId);
    res.status(200).json({
      message: 'Member added successfully',
      group
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves details of a chat group.
 * Expects groupId as a URL parameter.
 */
exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await chatService.getGroupDetails(groupId);
    res.status(200).json({ group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Sends a message in a chat group.
 * Expects request body: { groupId: String, senderId: String, message: String }
 * Only allows messages from members of the group.
 */
exports.sendMessage = async (req, res) => {
  try {
    const { groupId, senderId, message } = req.body;
    const result = await chatService.sendMessage(groupId, senderId, message);
    res.status(200).json({
      message: 'Message sent successfully',
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

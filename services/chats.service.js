const chatDb = require('../db/chatsdb');
const swipeService = require('./swipe.service');

/**
 * Creates a new chat group among matched users.
 * @param {string} groupName - Name of the group.
 * @param {string} creatorId - The ID of the group creator.
 * @param {Array} members - Array of user IDs to include (excluding creator).
 * @returns {Object} The created group object.
 */
exports.createGroup = async (groupName, creatorId, members) => {
  // Get the creator's matches from the swiping module.
  const matches = await swipeService.getMatches(creatorId);
  
  // Ensure every requested member is matched with the creator.
  for (let member of members) {
    if (!matches.includes(member)) {
      throw new Error(`User ${member} is not matched with the creator and cannot be added to the group.`);
    }
  }
  
  // Include the creator in the group members list.
  const groupMembers = [creatorId, ...members];
  
  // Create a new chat group in the database.
  const groupData = {
    groupName,
    members: groupMembers,
    createdAt: new Date()
  };
  const group = await chatDb.createChatGroup(groupData);
  return group;
};

/**
 * Adds a new member to an existing chat group.
 * @param {string} groupId - The chat group ID.
 * @param {string} newMemberId - The user ID to add.
 * @param {string} creatorId - The group creator's ID (for match checking).
 * @returns {Object} The updated group object.
 */
exports.addMember = async (groupId, newMemberId, creatorId) => {
  // Verify that the new member is matched with the creator.
  const matches = await swipeService.getMatches(creatorId);
  if (!matches.includes(newMemberId)) {
    throw new Error(`User ${newMemberId} is not matched with the creator and cannot be added.`);
  }
  
  // Add the member to the group.
  await chatDb.addMemberToGroup(groupId, newMemberId);
  
  // Return the updated group details.
  const updatedGroup = await chatDb.getChatGroupById(groupId);
  return updatedGroup;
};

/**
 * Retrieves details of a chat group.
 * @param {string} groupId - The chat group ID.
 * @returns {Object} The chat group details.
 */
exports.getGroupDetails = async (groupId) => {
  const group = await chatDb.getChatGroupById(groupId);
  if (!group) {
    throw new Error('Chat group not found.');
  }
  return group;
};

/**
 * Sends a message in a chat group.
 * @param {string} groupId - The ID of the chat group.
 * @param {string} senderId - The ID of the sender.
 * @param {string} messageText - The message text.
 * @returns {Object} The message data that was sent.
 */
exports.sendMessage = async (groupId, senderId, messageText) => {
  // Verify that the sender is a member of the group.
  const group = await chatDb.getChatGroupById(groupId);
  if (!group) {
    throw new Error('Chat group not found.');
  }
  if (!group.members.includes(senderId)) {
    throw new Error('Sender is not a member of this chat group.');
  }
  
  // Prepare message data.
  const messageData = {
    groupId,
    senderId,
    message: messageText,
    sentAt: new Date()
  };
  
  // Insert the message into the database.
  await chatDb.insertMessage(groupId, messageData);
  
  // Return the message data.
  return messageData;
};

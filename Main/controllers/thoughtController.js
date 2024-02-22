const { Thought, User, Reaction } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Creates a reaction
  async createReaction(req, res) {
    try {
      const reaction = await Reaction.create(req.body);
      res.json(reaction);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        res.status(404).json({ message: 'No thought with that ID' });
      }

      const user = await User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought deleted, but no user found',
        });
      }
      // await User.deleteMany({ _id: { $in: thought.users } });
      res.json({ message: 'Thought deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const reaction = await Reaction.findOneAndDelete({ _id: req.params.reactionId });

      if (!reaction) {
        res.status(404).json({ message: 'No reaction with that ID' });
      }

      const user = await User.findOneAndUpdate(
        { username: reaction.username },
        { $pull: { reactions: req.params.reactionId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Reaction deleted, but no user found',
        });
      }
      // await User.deleteMany({ _id: { $in: thought.users } });
      res.json({ message: 'Reaction deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
        return;
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

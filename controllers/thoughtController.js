const { Thought, User } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then(async (thoughts) => {
                const thoughtObj = {
                    thoughts
                };
                return res.json(thoughtObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Get a single thought
    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then(async (thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json({
                        thought
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Create a new thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: thought._id } },
                    {
                        new: true,
                        runValidators: true
                    },
                )
            })
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },
    // Delete a thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought exists with that ID' })
                    : res.json({ message: 'Deleted thought!' })
            )
            .then(() => {
                return User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    {
                        new: true,
                        runValidators: true
                    },
                )
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { 
                runValidators: true, 
                new: true 
            })
            .then((thought) =>
                !thought
                    ? res
                        .status(404)
                        .json({ message: 'No thought found with that ID :(' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Add a reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { 
                runValidators: true, 
                new: true }
        )
            .then((thought) =>
                !thought
                    ? res
                        .status(404)
                        .json({ message: 'No thought found with that ID :(' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Delete a reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { 
                runValidators: true, 
                new: true }
        )
            .then((thought) =>
                !thought
                    ? res
                        .status(404)
                        .json({ message: 'No thought found with that ID :(' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};

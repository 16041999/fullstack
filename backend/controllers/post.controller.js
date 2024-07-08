const PostModel = require('../models/post.model');

module.exports.getPosts = async(req, res) => {
    const posts = await PostModel.find();
    res.status(200).json(posts);
}

module.exports.setPosts = async(req, res) => {
    if (!req.body.message) {
        res.status(404).json({ message: "Merci d'ajouter un message" });
    }

    const post = await PostModel.create({
        message: req.body.message,
        author: req.body.author,
    });
    res.status(200).json(post);
};

module.exports.editPost = async(req, res) => {
    try {
        // Trouver le post par ID
        const post = await PostModel.findById(req.params.id);

        // Vérifier si le post existe
        if (!post) {
            return res.status(404).json({ message: "Ce Post n'existe pas" });
        }

        // Mettre à jour le post
        const updatePost = await PostModel.findByIdAndUpdate(
            post,
            req.body, { new: true } // Retourner le post mis à jour
        );

        // Vérifier si la mise à jour a réussi
        if (!updatePost) {
            return res.status(400).json({ message: "La mise à jour a échoué" });
        }

        // Retourner le post mis à jour
        res.status(200).json(updatePost);

    } catch (err) {
        // Gérer les erreurs et renvoyer une réponse appropriée
        res.status(500).json({ message: err.message });
    }
};

module.exports.deletePost = async function(req, res) {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Ce Post n'existe pas" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Message supprimer " + req.params.id });

};

module.exports.likePost = async function(req, res) {
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id, { $addToSet: { likers: req.body.userId } }, { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports.dislikePost = async function(req, res) {
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id, { $pull: { likers: req.body.userId } }, { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
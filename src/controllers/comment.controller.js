import Comment from '../models/comment.model.js';
import Bip from '../models/bip.model.js';

export const getComments = async (req, res) => {
  const comments = await Comment.find({
      //Me da solo los comentarios asociados al bip a traves del id
      bip: req.params.id
  });
  res.json(comments);
};

export const createComment = async (req, res) => {
    try {
      const { content, date } = req.body;
      const bipId = req.params.id;
      const userId = req.params.user 
  
      const newComment = new Comment({
        content,
        date,
        bip: bipId,
        user: userId
      });
  
      const savedComment = await newComment.save();
  
      const bip = await Bip.findByIdAndUpdate(
        bipId,
        { $push: { comments: newComment._id } },
        { new: true }
      );
  
      res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        comment: newComment,
        bip: bip,
        commentId: savedComment._id
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };

export const getComment = async (req, res) => {
    try {
      const commentId = req.params.id;
  
      const comment = await Comment.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found',
        });
      }
  
      res.status(200).json({
        success: true,
        comment: comment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };

  export const deleteComment = async (req, res) => {
    try {
      const commentId = req.params.id;
  
      const deletedComment = await Comment.deleteOne({ _id: commentId });
  
      if (!deletedComment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
        comment: deletedComment,
      });
    } catch (error) {
      console.error(error);
      // Agrego esta línea para imprimir el mensaje de error específico en la consola del servidor
      console.error(error.message); 

      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };
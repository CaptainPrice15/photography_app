"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  content: string;
  created_at: string;
}

interface PhotoCommentsProps {
  photoId: string;
  comments: Comment[];
  isAuthenticated?: boolean;
  onAddComment?: (photoId: string, content: string) => void;
}

export function PhotoComments({
  photoId,
  comments,
  isAuthenticated = false,
  onAddComment,
}: PhotoCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    onAddComment?.(photoId, newComment);
    setNewComment("");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <h4 className="font-medium flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Comments ({comments.length})
      </h4>

      {/* Add comment form */}
      {isAuthenticated ? (
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button
            onClick={handleSubmit}
            disabled={!newComment.trim() || isSubmitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="text-primary hover:underline">
            Sign in
          </a>{" "}
          to leave a comment
        </p>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {comment.user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{comment.user.username}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}

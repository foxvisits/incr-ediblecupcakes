import React, { useState } from 'react';
import { Heart, Share2, Bookmark, Star, MessageCircle, ThumbsUp } from 'lucide-react';

interface RecipeInteractionsProps {
  recipeId: string;
  initialLikes?: number;
  initialRating?: number;
  initialBookmarks?: number;
}

const RecipeInteractions: React.FC<RecipeInteractionsProps> = ({
  recipeId,
  initialLikes = 0,
  initialRating = 0,
  initialBookmarks = 0
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [userRating, setUserRating] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ question: '', answer: 0 });
  const [comments, setComments] = useState([]);

  // Generate simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    let question;
    
    if (operator === '+') {
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    } else {
      // Ensure positive result for subtraction
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      answer = larger - smaller;
      question = `${larger} - ${smaller} = ?`;
    }
    
    setCaptchaQuestion({ question, answer });
  };

  // Generate captcha on component mount and when comments are shown
  React.useEffect(() => {
    if (showComments) {
      generateCaptcha();
    }
  }, [showComments]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setBookmarks(prev => isBookmarked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this amazing cupcake recipe!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newComment.trim()) {
      alert('Please enter a comment.');
      return;
    }
    
    if (!userName.trim()) {
      alert('Please enter your name.');
      return;
    }
    
    // Validate captcha
    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      alert('Please solve the math problem correctly.');
      return;
    }
    
    if (newComment.trim() && userName.trim() && parseInt(captchaAnswer) === captchaQuestion.answer) {
      const comment = {
        id: comments.length + 1,
        author: userName.trim(),
        comment: newComment,
        rating: userRating,
        date: 'Just now',
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setUserName('');
      setUserEmail('');
      setCaptchaAnswer('');
      setUserRating(0);
      generateCaptcha(); // Generate new captcha for next comment
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
              isLiked 
                ? 'bg-rose-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600'
            }`}
            aria-label={isLiked ? 'Unlike this recipe' : 'Like this recipe'}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{likes}</span>
          </button>

          <button
            onClick={handleBookmark}
            className={`font-quicksand flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
              isBookmarked 
                ? 'bg-sunshine-400 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-sunshine-100/50 hover:text-sunshine-600'
            }`}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Bookmark this recipe'}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="font-medium">{bookmarks}</span>
          </button>

          <button
            onClick={handleShare}
            className="font-quicksand flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-sprinkle-blue/20 hover:text-sprinkle-blue transition-all duration-300 transform hover:scale-105"
            aria-label="Share this recipe"
          >
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </button>
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className="font-quicksand flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-300"
          aria-label={`${showComments ? 'Hide' : 'Show'} comments`}
          aria-expanded={showComments}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">{comments.length} Comments</span>
        </button>
      </div>

      {/* Rating Section */}
      <div className="mb-6">
        <h3 className="font-quicksand font-bold text-gray-900 mb-3">Rate this recipe:</h3>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`font-quicksand flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                star <= userRating
                  ? 'bg-cupcake-coral text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-cupcake-pink/20 hover:text-cupcake-coral'
              }`}
            >
              <Star className="w-full h-full fill-current" />
            </button>
          ))}
          {userRating > 0 && (
            <span className="font-nunito ml-2 text-sm text-gray-600">
              You rated this {userRating} star{userRating !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-6">
          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="bg-gray-50 rounded-xl p-4">
            {/* Name and Email Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-bold text-gray-700 mb-2 font-quicksand">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="font-nunito w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cupcake-coral focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="userEmail" className="block text-sm font-bold text-gray-700 mb-2 font-quicksand">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="font-nunito w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cupcake-coral focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Comment Textarea */}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience with this recipe..."
              className="font-nunito w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cupcake-coral focus:border-transparent resize-none"
              rows={3}
              required
            />
            
            {/* Captcha */}
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <label htmlFor="captcha" className="block text-sm font-bold text-gray-700 mb-2 font-quicksand">
                Security Check: {captchaQuestion.question}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  id="captcha"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  placeholder="Answer"
                  className="font-nunito w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cupcake-coral focus:border-transparent text-center"
                  required
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="font-nunito text-sm text-cupcake-coral hover:text-cupcake-cherry transition-colors duration-300"
                >
                  New Question
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <span className="font-nunito text-sm text-gray-600">Your rating:</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(star)}
                      className={`w-5 h-5 transition-colors duration-200 ${
                        star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() || !userName.trim() || !captchaAnswer.trim()}
                className="font-quicksand px-6 py-2 bg-gradient-to-r from-cupcake-coral to-sunshine-400 text-white rounded-lg hover:from-cupcake-cherry hover:to-sunshine-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-bold transform hover:scale-105 disabled:hover:scale-100"
              >
                Post Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cupcake-coral to-sunshine-400 rounded-full flex items-center justify-center text-white font-bold">
                    {comment.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-quicksand font-bold text-gray-900">{comment.author}</h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(comment.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="font-nunito text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="font-nunito text-gray-700 mb-2">{comment.comment}</p>
                    <button className="font-nunito flex items-center space-x-1 text-sm text-gray-500 hover:text-cupcake-coral transition-colors duration-300">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeInteractions;

import React from 'react';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { formatTime } from '../utils/gameUtils';

interface ShareButtonProps {
  gameState: 'won' | 'lost';
  elapsedTime: number;
  guesses: string[];
  targetWord: string;
}

const ShareButton = ({ gameState, elapsedTime, guesses, targetWord }: ShareButtonProps) => {
  const handleShare = async () => {
    const resultText = gameState === 'won' 
      ? `🎉 Wordle Timer - Solved in ${formatTime(elapsedTime)}!\nGuesses: ${guesses.length}/6`
      : `😔 Wordle Timer - Game Over\nGuesses: ${guesses.length}/6`;
    
    const shareText = `${resultText}\n\nPlay at: ${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Wordle Timer',
          text: shareText,
        });
        toast({
          title: "Shared successfully!",
          description: "Results shared via system share menu",
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard!",
          description: "Share text copied to your clipboard",
        });
      }
    } catch (error) {
      // Fallback - just show the text in a toast
      toast({
        title: "Share your result:",
        description: resultText,
      });
    }
  };

  return (
    <Button 
      onClick={handleShare}
      variant="outline"
      className="w-full"
    >
      <Share className="w-4 h-4 mr-2" />
      Share Result
    </Button>
  );
};

export default ShareButton;

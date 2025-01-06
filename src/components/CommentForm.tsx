import { createSignal } from 'solid-js';
import { Button } from './ui/button.tsx';
import { TextField, TextFieldInput } from './ui/text-field.tsx';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  buttonText?: string;
}

export function CommentForm({
  onSubmit,
  placeholder = 'Write a comment...',
  buttonText = 'Post Comment',
}: CommentFormProps) {
  const [content, setContent] = createSignal('');

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (content().trim()) {
      onSubmit(content());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <TextField>
        <TextFieldInput
          class="w-full"
          placeholder={placeholder}
          value={content()}
          onchange={(e: { target: { value: string } }) =>
            setContent(e.target.value)
          }
        />
      </TextField>
      <Button type="submit" disabled={!content().trim()}>
        {buttonText}
      </Button>
    </form>
  );
}

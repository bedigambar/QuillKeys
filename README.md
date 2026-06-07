<div align="center">
  <a href="https://quill-keys.vercel.app">
    <img src="./public/icon.webp" alt="QuillKeys Logo" width="240" style="border-radius: 24px; margin-bottom: 20px;" />
  </a>


> *"You do not need to leave your room. Remain sitting at your table and listen. The world will freely offer itself to you to be unmasked."* — Franz Kafka

**QuillKeys** is not just another typing test. It's a journey through the profound minds of literary giants, where every keystroke echoes the philosophies of Kafka, Dostoevsky, Camus, and Gogol, and the timeless verses of Whitman, Dickinson, Frost, and Poe.

</div>

---

## 📖 The Philosophy

Why type mundane sentences when you can type wisdom that has shaped human thought for generations? QuillKeys transforms typing practice into an intellectual experience, letting you absorb existential musings while improving your typing speed.

## ✨ Features

- **Literary Passages**: Type through authentic excerpts from masterworks of existential philosophy and timeless poetry
- **Real-time Analytics**: Track your WPM, accuracy, and progress as you type
- **Smart Error Tracking**: Advanced logic that accurately tracks missed keys and skipped words for precise accuracy calculation
- **Keyboard Heatmap**: Visual keyboard showing which keys you struggle with most, color-coded by error frequency
- **History Tracking**: View your complete typing test history with detailed statistics, performance charts, and progress over time
- **Font Themes**: Choose from 6 beautiful font styles (Mono, Sans, Serif, Merriweather, Roboto, Fira) to match your preference
- **Caret Customization**: Select your preferred caret style (Block, Line, or Underline)
- **Zen Mode**: Distraction-free typing experience with a minimalist interface
- **Focus Mode**: Blur upcoming text to help you concentrate on the current words
- **Customised Test Lengths**: 15, 30, 60-second or customised typing sessions to match your pace.
- **Mood-Adaptive Selection**: Dynamically analyzes your typing rhythm (standard deviation of inter-keystroke intervals + accuracy) to classify your state and select the next passage (e.g., tense/erratic = Camus, flowing/steady = Woolf, deliberate = Kafka).
- **Author Style Fingerprint**: Side-by-side comparative analysis of your typing patterns against an author's actual style profile (measuring sentence length distribution, punctuation density per 100 words, and vocabulary complexity). Unlock this visual fingerprint by completing 5 passages from any author.
- **Kinetic Text Mirror**: Typographic layout that grows larger (up to 1.35x) when typing slowly and deliberately (Adagio/Andante) and shrinks smaller (down to 0.75x) when typing fast or frantically (Allegro/Presto).
- **Shareable Signature Card**: Export a premium, high-contrast solid black and gold visual certificate of your typing run containing an SVG graph of your speed fluctuations, key metrics, and a pulled excerpt from the text.
## 🎥 Demo Video

Check out the application in action:



https://github.com/user-attachments/assets/d4f59b2f-930a-4f81-b1f3-0f0ec794e5a8





## 🖤 Meet Your Literary Mentors

<div align="center">

### Franz Kafka
*The Master of Absurdism*

"The longer and more carefully we look at a funny story, the sadder it becomes."

---

### Fyodor Dostoevsky
*The Psychologist of the Soul*

"The mystery of human existence lies not in just staying alive, but in finding something to live for."

---

### Virginia Woolf
*The Pioneer of Flowing Prose*

"The light blade of her mind shivered the tree of life, and the leaves came falling, gold and green."

---

### Walt Whitman
*The Bard of Democracy*

"I celebrate myself, and sing myself."

---

### Emily Dickinson
*The Recluse of Amherst*

"Hope is the thing with feathers."

<br/>

*...and many more including Camus, Gogol, Frost, and Poe.*

</div>

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone this repository
git clone https://github.com/bedigambar/QuillKeys.git

# Navigate to the project directory
cd QuillKeys

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`


## 🛠️ Tech Stack

- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** 
- **React Router**

## 🎯 How It Works

1. **Choose Your Duration**: Select from 15, 30, 60-second or customised time for tests (max 600 second)
2. **Start Typing**: Begin typing the passage displayed on screen
3. **Watch Your Stats**: See your WPM and accuracy update in real-time
4. **View Results**: Get detailed statistics after completing the test
5. **Try Again**: Challenge yourself with different passages from various authors

## 🤝 Contributing

Contributions are welcome! Whether it's:

- Adding more literary passages
- Improving the UI/UX
- Fixing bugs
- Adding new features

Please feel free to open an issue or submit a pull request.

### Adding New Passages

To add new literary passages, edit `src/data/questions.ts`:

```typescript
{
   id: "unique-id",
   contentType: "prose" | "poetry",
   category: "Author Name",
   text: "Your passage text here..."
}
```

## 📝 License & Attribution

QuillKeys is released under the [MIT License](https://github.com/bedigambar/QuillKeys/blob/main/LICENSE) — © 2026 bedigambar.

You're welcome to use, modify and build on this code, but you must keep the copyright notice and license intact (i.e. give credit). If you ship something based on QuillKeys, a shout-out and a link back to [this repo](https://github.com/bedigambar/QuillKeys) is hugely appreciated. 🙏

## 🌟 Acknowledgments

- Inspired by the profound works of existential and philosophical literature
- Built with love for both coding and classic literature


<div align="center">

### 💭 Final Thought

*"The mystery of human existence lies not in just staying alive, but in finding something to live for."*

**Type with purpose. Type with QuillKeys.**

[⭐ Star this repo](https://github.com/bedigambar/QuillKeys) | [🐛 Report Bug](https://github.com/bedigambar/QuillKeys/issues) | [✨ Request Feature](https://github.com/bedigambar/QuillKeys/issues)

</div>

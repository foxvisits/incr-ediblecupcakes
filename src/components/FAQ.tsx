import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How should I store cupcakes to maintain freshness?',
    answer: 'Store cupcakes in an airtight container at room temperature for up to 3 days. For longer freshness, freeze them for up to 3 months. Thaw at room temperature before serving.'
  },
  {
    question: 'Can I substitute ingredients for gluten-free options?',
    answer: 'Yes! In most of our recipes, you can replace wheat flour with a 1:1 gluten-free flour blend. Remember to use gluten-free baking powder as well.'
  },
  {
    question: 'How do I achieve the perfect frosting consistency?',
    answer: 'The key to perfect frosting is ingredient temperature (butter and cream cheese should be at room temperature) and proper aeration. Beat the frosting at medium speed for 5-7 minutes.'
  },
  {
    question: 'Why do my cupcakes sink after baking?',
    answer: 'Cupcake sinking can be caused by several factors: opening the oven too early, incorrect baking temperature, expired baking powder, or too much liquid in the batter.'
  },
  {
    question: 'How do I adjust recipes for high altitude?',
    answer: 'At higher altitudes, reduce baking powder by 1/8 teaspoon per 1,000 feet, increase temperature by 25°F, and extend baking time by 5-8 minutes.'
  },
  {
    question: 'What egg substitutes can I use in vegan recipes?',
    answer: 'Popular substitutes include: mashed banana (1 egg = 1/4 banana), chia or flax seeds (1 egg = 1 tbsp seeds + 3 tbsp water), applesauce (1 egg = 1/4 cup), or aquafaba (1 egg = 3 tbsp).'
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Często Zadawane Pytania
        </h2>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

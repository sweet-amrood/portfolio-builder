import { useEffect } from 'react';
import { loadFontsFromContent } from '../../utils/loadPortfolioFont';

export default function PortfolioFontLoader({ content }) {
  useEffect(() => {
    loadFontsFromContent(content);
  }, [content?.templateBodyFont, content?.templateFont, content?.templateHeadingFont, content?.fieldStyles]);

  return null;
}

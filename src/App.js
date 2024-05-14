import React, { useState, useEffect } from 'react';
import PresentationEditor from './components/PresentationEditor';
import Slide from './components/Slide';
import backgroundImage from './background.png';
import pptxgen from 'pptxgenjs';
import './App.css';

function App() {
  const [pageContent, setPageContent] = useState(`
  欢迎使用 大纲笔记 - 一键生成放映级演示
    点击右上角【演示】按钮，即可一键生成放映级演示。
      ·自带动画效果，无需手动排版。
      · 提供丰富的演示背景。
      · 支持双屏显示，可跳转到任意节点。
      · 支持文本编辑样式。
      · 支持插入图片。
    支持导出PPT进行二次编辑。
    您可以拖拽“●”，或使用快捷键来调整内容。
    选中文字，即可通过弹出的文本编辑栏调整样式。
    您输入的链接地址将被自动识别。
    若有其他疑问，欢迎咨询官网在线客服。
  Welcome to Outline Notes - Automatic presentation generation
    Click on [Presentation] in the top right corner to automatically generate a presentation.
      · The presentation mode comes with smooth animations and does not require manual typesetting.
      · The presentation mode provides you with rich background images.
      · Support a dual-screen display and can be switched to any node.
      · Support for text styles.
      · Support for inserting images.
    You can export PPT for custom editing.
    You may drag and drop the "●", or use the shortcut keys to edit the content.
    Select the text, change their styles with the pop-up editor bar.
    The full link will be recognized automatically.
    For other questions, please contact the official customer service.
  `);
  const [presentationContent, setPresentationContent] = useState([]);
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const generatePresentation = () => {
    const slides = convertToSlides(pageContent);
    setPresentationContent(slides);
    setShowPresentation(true);
    setCurrentSlide(0);
  };

  const handleContentChange = (content) => {
    setPageContent(content);
    setShowPresentation(false);
  };

  const exportToPPT = () => {
    const pptx = new pptxgen();
    presentationContent.forEach((slideContent, index) => {
      const slide = pptx.addSlide();
      slide.addText(slideContent.content, { x: 0.5, y: 0.5, w: '90%', h: 3, fontSize: 18 });
      slide.addImage({ path: slideContent.backgroundImage, x: 0, y: 0, w: '100%', h: '100%' });
    });
    pptx.writeFile('presentation.pptx');
  };

  const nextSlide = () => {
    if (!isTransitioning && currentSlide < presentationContent.length - 1) {
      setIsTransitioning(true);
      setCurrentSlide(currentSlide + 1);
      setTimeout(() => setIsTransitioning(false), 1000); // Duration of the animation
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>大纲笔记</h1>
        <button className="generate-btn" onClick={generatePresentation}>演示</button>
      </header>
      <main className="App-main">
        {!showPresentation && (
          <PresentationEditor
            content={pageContent}
            onContentChange={handleContentChange}
            onExportPPT={exportToPPT}
            onStartPresentation={generatePresentation}
          />
        )}
        {showPresentation && (
          <div className={`presentation ${isTransitioning ? 'transitioning' : ''}`} onClick={nextSlide}>
            {presentationContent.length > 0 && (
              <Slide
                key={currentSlide}
                content={presentationContent[currentSlide].content}
                backgroundImage={presentationContent[currentSlide].backgroundImage}
                onClick={nextSlide}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function convertToSlides(content) {
  return content
    .split('\n')
    .filter(item => item.trim() !== '')
    .map((item) => {
      return {
        content: item.trim(),
        backgroundImage,
      };
    });
}

export default App;

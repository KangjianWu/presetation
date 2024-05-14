import React, { useRef, useState } from 'react';
import './PresentationEditor.css';


function PresentationEditor({ content, onContentChange, onExportPPT, onStartPresentation }) {
  const editableRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState([]);
  const [fixedActions, setFixedActions] = useState(null);

  const handleContentChange = () => {
    onContentChange(editableRef.current.innerHTML);
  };

  const insertImage = () => {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'image/*');
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        const paragraph = document.createElement('div');
        paragraph.className = 'paragraph';
        paragraph.appendChild(img);
        editableRef.current.appendChild(paragraph);
        onContentChange(editableRef.current.innerHTML);
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  };

  const handleParagraphChange = (event) => {
    onContentChange(editableRef.current.innerHTML);
  };

  const handleDeleteParagraph = (index) => {
    const paragraphs = content.split('\n').filter(text => text.trim() !== '');
    paragraphs.splice(index, 1);
    onContentChange(paragraphs.join('\n'));
  };

  const moveParagraphUp = (index) => {
    if (index > 0) {
      const paragraphs = content.split('\n').filter(text => text.trim() !== '');
      [paragraphs[index - 1], paragraphs[index]] = [paragraphs[index], paragraphs[index - 1]];
      onContentChange(paragraphs.join('\n'));
    }
  };

  const moveParagraphDown = (index) => {
    const paragraphs = content.split('\n').filter(text => text.trim() !== '');
    if (index < paragraphs.length - 1) {
      [paragraphs[index + 1], paragraphs[index]] = [paragraphs[index], paragraphs[index + 1]];
      onContentChange(paragraphs.join('\n'));
    }
  };

  const renderParagraphs = () => {
    return content.split('\n').filter(text => text.trim() !== '').map((text, index) => {
      const indentLevel = getIndentLevel(text);
      const isTitle = indentLevel === 0 || indentLevel === 1;
      const isActive = activeIndex.includes(index) || (activeIndex.includes(1) && indentLevel === 2);
      return (
        <div
          key={index}
          className={`paragraph-container level-${indentLevel} ${isActive ? 'active' : ''}`}
          style={{ display: activeIndex.length === 0 || isActive ? 'flex' : 'none' }}
        >
          <div className="paragraph-actions">
            <button 
              className="toggle-actions"
              onClick={() => setFixedActions(fixedActions === index ? null : index)}
            >
              •••
            </button>
            {fixedActions === index && (
              <div className="actions-menu">
                <button onClick={() => onStartPresentation(index)}>从此节点演示</button>
                <button onClick={insertImage}>插入图片</button>
                <button onClick={() => navigator.clipboard.writeText(text)}>复制文本</button>
                <button onClick={() => handleDeleteParagraph(index)}>删除</button>
                <button onClick={() => moveParagraphUp(index)}>上移</button>
                <button onClick={() => moveParagraphDown(index)}>下移</button>
              </div>
            )}
          </div>
          {isTitle && (
            <button className="toggle-button" onClick={() => toggleContent(index, indentLevel)}></button>
          )}
          <div className="vertical-line" />
          <div className="paragraph" contentEditable suppressContentEditableWarning onInput={handleParagraphChange}>
            {text.trim()}
          </div>
        </div>
      );
    });
  };

  const getIndentLevel = (text) => {
    if (text.startsWith('      ·')) return 2;
    if (text.startsWith('    ')) return 1;
    return 0;
  };

  const toggleContent = (index, indentLevel) => {
    if (indentLevel === 0) {
      setActiveIndex(activeIndex.includes(index) ? [] : [0, 1, 2]);
    } else if (indentLevel === 1) {
      setActiveIndex(activeIndex.includes(index) ? activeIndex.filter(i => i !== index && i !== index + 1) : [...activeIndex, index, index + 1]);
    }
  };

  return (
    <div className="presentation-editor">
      <div ref={editableRef} className="editable-content" onInput={handleContentChange}>
        {renderParagraphs()}
      </div>
      <div className="editor-actions">
        <button className="insert-image-btn" onClick={insertImage}>
          插入图片
        </button>
        <button className="export-ppt-btn" onClick={onExportPPT}>
          导出PPT
        </button>
      </div>
    </div>
  );
}

export default PresentationEditor;

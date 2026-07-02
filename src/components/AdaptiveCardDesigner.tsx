import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import * as markdownit from 'markdown-it';
import * as ACDesigner from 'adaptivecards-designer';
import 'adaptivecards-designer/dist/adaptivecards-designer.css';
import '../monaco-setup';

interface AdaptiveCardDesignerProps {
  onSave?: (payload: any) => void;
}

export default function AdaptiveCardDesignerComponent({ onSave }: AdaptiveCardDesignerProps) {
  const designerRef = useRef<HTMLDivElement>(null);
  const designerInstance = useRef<ACDesigner.CardDesigner | null>(null);

  useEffect(() => {
    if (!designerRef.current || designerInstance.current) return;

    // Set up markdown processor
    ACDesigner.CardDesigner.onProcessMarkdown = (text, result) => {
      result.outputHtml = new markdownit.default().render(text);
      result.didProcess = true;
    };

    // Initialize designer
    ACDesigner.GlobalSettings.enableDataBindingSupport = true;
    const hostContainers: any[] = [];
    const designer = new ACDesigner.CardDesigner(hostContainers);
    
    // Configure toolbar to add a save button
    if (onSave) {
      const saveButton = new ACDesigner.ToolbarButton(
        'saveButton',
        'Save Card',
        null,
        () => {
          if (designerInstance.current) {
            onSave(designerInstance.current.getCard());
          }
        }
      );
      saveButton.separator = true;
      designer.toolbar.insertElementAfter(saveButton, ACDesigner.CardDesigner.ToolbarCommands.HostAppPicker);
    }

    designerInstance.current = designer;
    
    // Attach to DOM
    designer.attachTo(designerRef.current);
    designer.monacoModuleLoaded(monaco);

    // Initial card setup
    designer.setCard({
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'TextBlock',
          text: 'Welcome to the Adaptive Cards Designer!',
          weight: 'Bolder',
          size: 'Medium'
        }
      ]
    });

    return () => {
      // Cleanup logic if needed (adaptivecards-designer doesn't have a clear destroy method in basic usage)
      if (designerRef.current) {
        designerRef.current.innerHTML = '';
      }
      designerInstance.current = null;
    };
  }, [onSave]);

  return (
    <div className="w-full h-full min-h-[600px] bg-white text-black" ref={designerRef}></div>
  );
}

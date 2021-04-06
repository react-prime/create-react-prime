import { readdirSync } from 'fs';
import path from 'path';
import { ListChoiceOptions } from 'inquirer';

import Question from 'core/decorators/Question';
import cliMgr from 'core/CLIMgr';
import Util from 'core/util';


@Question({
  type: 'list',
  name: 'editor',
  message: 'Open project in editor?',
  afterInstall: true,
  OS: ['mac'],
})
class OpenEditorQuestion {
  when = (): boolean => {
    return this.choices().length > 1;
  }

  choices = (): ListChoiceOptions[] => {
    const choices: ListChoiceOptions[] = [{
      name: 'No, complete installation',
      value: false,
    }];

    const foundEditors = this.getEditorsList();
    choices.push(...foundEditors);

    return choices;
  }

  /** Open an editor programatically */
  async answer(answers: { editor: EditorSearchItem }): Promise<void> {
    if (!answers.editor?.path) {
      return;
    }

    const dir = path.resolve(cliMgr.getProjectName());

    const util = new Util();
    await util.asyncExec(`open ${dir} -a ${answers.editor.path}`);
  }


  /** Look for editors in the Applications folder */
  private getEditorsList = (): ChoiceItem[] => {
    const editors: ChoiceItem[] = [];
    const files = readdirSync('/Applications/');

    for (const file of files) {
      const filePath = file.toLowerCase();

      for (const editor of this.editors) {
        if (filePath.includes(editor.search)) {
          editor.path = file.replace(/(\s+)/g, '\\$1');
        }
      }
    }

    // Add found editors to a list of editors
    for (const editor of this.editors) {
      if (editor.path) {
        editors.push({
          name: editor.name,
          value: editor,
        });
      }
    }

    return editors;
  }

  /** Editors to look for */
  private readonly editors: EditorSearchItem[] = [
    {
      name: 'Visual Studio Code',
      search: 'visual studio',
    },
    {
      name: 'Atom',
      search: 'atom',
    },
    {
      name: 'Sublime Text',
      search: 'sublime',
    },
  ];
}

interface ChoiceItem {
  name: string;
  value: EditorSearchItem;
}

interface EditorSearchItem {
  name: string;
  search: string;
  path?: string;
}

export default OpenEditorQuestion;

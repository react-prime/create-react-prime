import util from 'util';
import cp from 'child_process';
import path from 'path';
import { readdirSync } from 'fs';
import * as i from 'types';
import { ListQuestion, ListChoiceOptions } from 'inquirer';
import Question from './Question';


const exec = util.promisify(cp.exec);


/**
 * Ask user to select an editor to open the project in
 * */
export default class SelectEditor extends Question implements i.CRPQuestion<ListQuestion> {
  macOnly = true;

  /**
   * Question options
   */
  readonly type = 'list';
  readonly name = 'editor';
  readonly message = 'Open project in editor?';

  choices: ListChoiceOptions[] = [{
    name: 'No',
    value: false,
  }];

  /**
   * Editors
   */
  private readonly editors: i.EditorSearch[] = [
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


  constructor(
    protected cliMgr: i.CLIMgrType,
  ) {
    super();
    this.init();
  }


  /** Open an editor programatically */
  async answer(answers: { editor?: i.EditorSearch }): Promise<void> {
    if (!answers.editor?.path) {
      return;
    }

    const dir = path.resolve(this.cliMgr.projectName!);

    await exec(`open ${dir} -a ${answers.editor.path}`);
  }


  /**
   * Look for editors in the Applications folder
   * Add found editors to choices
   */
  private init(): void {
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
        this.choices.push({
          name: editor.name,
          value: editor,
        });
      }
    }
  }
}

import { withPluginApi } from "discourse/lib/plugin-api";
import { traverseNodes, readInputList} from '../lib/utilities';

export default {
  name: 'discourse-abbrify-initializer',
  initialize(){
    withPluginApi("0.8.7", api => {

      // roughly guided by https://stackoverflow.com/questions/8949445/javascript-bookmarklet-to-replace-text-with-a-link
      let skipTags = {
        'a': 1,
        'abbr': 1,
        'iframe': 1,
      };
  
      settings.excluded_tags.split('|').forEach(tag => {
        tag = tag.trim().toLowerCase();
        if (tag !== '') {
          skipTags[tag] = 1;
        }
      });

      let skipClasses = {};

      settings.excluded_classes.split('|').forEach(cls => {
        cls = cls.trim().toLowerCase();
        if (cls !== '') {
          skipClasses[cls] = 1;
        }
      });

      let createAbbr = function(text, title) {
          let abbr = document.createElement('abbr');
          abbr.innerHTML = text;
          abbr.title = title;
          abbr.className = 'abbrify-word';
          return abbr;
      };

      let Action = function(inputListName, method) {
        this.inputListName = inputListName;
        this.createNode = method;
        this.inputs = {};
      };
  
      let abbrify = new Action('abbreviations', createAbbr);
      let actions = [abbrify];
      actions.forEach(readInputList);
        
      api.decorateCooked($elem => {
        actions.forEach(action => {
          if (Object.keys(action.inputs).length > 0) {
            traverseNodes($elem[0], action, skipTags, skipClasses)
          }
        });
      }, {'id': 'abbrify-words-theme-component'});
    });
  }
}

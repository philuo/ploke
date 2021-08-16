import hljs from './core';

import typescript from './languages/typescript';
import c from './languages/c';
import cpp from './languages/cpp';
import cmake from './languages/cmake';
import php from './languages/php';
import java from './languages/java';
import go from './languages/go';
import sql from './languages/sql';
import rust from './languages/rust';
import scss from './languages/scss';
import python from './languages/python';
import json from './languages/json';
import yaml from './languages/yaml';
import shell from './languages/shell';
import nginx from './languages/nginx';
import xml from './languages/xml';
import markdown from './languages/markdown';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('cmake', cmake);
hljs.registerLanguage('php', php);
hljs.registerLanguage('java', java);
hljs.registerLanguage('go', go);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('python', python);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('markdown', markdown);

export default hljs;
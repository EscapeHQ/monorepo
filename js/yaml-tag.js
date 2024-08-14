// origin: https://github.com/jeanfredrik/yaml-tag
// <script type="module" src="https://cdn.jsdelivr.net/gh/EscapeHQ/monorepo@main/js/yaml-tag.js"></script>
//import { yaml } from "https://cdn.jsdelivr.net/gh/nodeca/js-yaml@master/dist/js-yaml.mjs"

function createReplacementNodeType(replacements) {
  return new yaml.Type('!templateLiteralExpressionReplacement', {
    // Loader must parse sequence nodes only for this type (i.e. arrays in JS terminology).
    // Other available kinds are 'scalar' (string) and 'mapping' (object).
    // http://www.yaml.org/spec/1.2/spec.html#kind//
    kind: 'scalar',

    // There should be no point in validating the input.
    resolve: function (data) {
      return true;
    },

    // If a node is resolved, fetch the replacement.
    construct: function (data) {
      return replacements[data];
    },

    // Dumper should never encounter this node type.
    instanceOf: null,

    // Dumper should never encounter this node type.
    represent: function (replacement) {
      return null;
    }
  });
}

function parse(strings, ...replacements) {
  if(replacements.length > 0) {
    const ReplacementNodeType = createReplacementNodeType(replacements);
    const input = replacements.reduce(
      (result, replacement, index) => `${result}!templateLiteralExpressionReplacement ${index}${strings.raw[index + 1]}`,
      strings.raw[0]
    );
    const schema = yaml.Schema.create([ ReplacementNodeType ]);
    return yaml.load(input, {schema});
  }
  return yaml.load(strings.raw.join(''));
}

export { yaml, parse, createReplacementNodeType };

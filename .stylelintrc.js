// 'font-family-no-missing-generic-family-keyword': true,
// запрещает отсутствие общих шрифтов в конце, например, serif или sans-serif
// 'font-family-no-missing-generic-family-keyword': true,

'use strict';

module.exports = {
	"plugins": [
		'stylelint-scss'
	],
	"rules": {
		'at-rule-no-unknown': null,
		'block-no-empty': true,
		'color-no-invalid-hex': true,
		'comment-no-empty': true,
		'declaration-block-no-duplicate-properties': [
			true,
			{
				ignore: ['consecutive-duplicates-with-different-values']
			}
		],
		'declaration-block-no-redundant-longhand-properties': true,
		'declaration-block-no-shorthand-property-overrides': true,
		'font-family-no-duplicate-names': true,
		'function-calc-no-unspaced-operator': true,
		'function-linear-gradient-no-nonstandard-direction': true,
		'keyframe-declaration-no-important': true,
		'media-feature-name-no-unknown': true,
		'no-descending-specificity': true,
		'no-duplicate-at-import-rules': true,
		'no-duplicate-selectors': true,
		'no-empty-source': true,
		'no-extra-semicolons': true,
		'no-invalid-double-slash-comments': true,
		'property-no-unknown': true,
		'selector-pseudo-class-no-unknown': true,
		'selector-pseudo-element-no-unknown': true,
		'selector-type-no-unknown': true,
		'string-no-newline': true,
		'string-quotes': 'double',
		'unit-no-unknown': true,
		'block-opening-brace-space-before': 'always',
		'block-closing-brace-newline-after': [
			'always', {
				ignoreAtRules: ['if', 'else']
			}
		],
		'at-rule-name-space-after': 'always',
		'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
		'scss/at-else-closing-brace-space-after': 'always-intermediate',
		'scss/at-else-empty-line-before': 'never',
		'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
		'scss/at-if-closing-brace-space-after': 'always-intermediate',
		'scss/selector-no-redundant-nesting-selector': true
	}
};

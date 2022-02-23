// @index('./*Input.{js,ts,tsx,jsx}', (f, _)=> `export { default as ${_.pascalCase(f.name)} } from '${f.path}'`)
export { default as BigintInput } from './BigintInput'
export { default as BooleanInput } from './BooleanInput'
export { default as CitextInput } from './CitextInput'
export { default as DateInput } from './DateInput'
export { default as DateTimeInput } from './DateTimeInput'
export { default as DefaultInput } from './DefaultInput'
export { default as Float8Input } from './Float8Input'
export { default as FloatInput } from './FloatInput'
export { default as IdInput } from './IdInput'
export { default as IntInput } from './IntInput'
export { default as JsonbInput } from './JsonbInput'
export { default as NumberInput } from './NumberInput'
export { default as RelationshipInput } from './RelationshipInput'
export { default as RichTextInput } from './RichTextInput'
export { default as SelectInput } from './SelectInput'
export { default as StringInput } from './StringInput'
export { default as TextInput } from './TextInput'
export { default as TimestampInput } from './TimestampInput'
export { default as TimestamptzInput } from './TimestamptzInput'
export { default as UuidInput } from './UuidInput'
// @endindex

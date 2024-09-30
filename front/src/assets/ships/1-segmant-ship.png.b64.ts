const dataUrl = 'data:image/png;base64,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';
export default dataUrl;
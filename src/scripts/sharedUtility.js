export function showLoader(parentClass) {
    document.querySelector(parentClass).classList.remove('d-none');
    document.querySelector(parentClass).nextElementSibling.classList.add('d-none');
}

export function hideLoader(parentClass) {
    document.querySelector(parentClass).classList.add('d-none');
    document.querySelector(parentClass).nextElementSibling.classList.remove('d-none');
}

export function errorLogMessageFormatter(messagePrefix, customMessage) {
    return messagePrefix + ' - ' + customMessage + ' ';
}
export const getTranslateByKey = (key) => {
    const translate = localStorage.getItem("translate");

    if(translate) {
        const parseTranslate = JSON.parse(translate);
        const result = parseTranslate.find(el => el.setting_key === key);

        return result ? result : {setting_value: key};
    } else {
        return "";
    }
}

import path, { join } from 'path';

export const MAIL_TEMPLATES_PATH = join(__dirname, 'mails/');

// a helper function which generates the full path to the mail template
export const getFullTemplatePath = (templatePath: string): string => {
    // console.log('===============%%%%%%%%%%%%%5=====================');
    // console.log(MAIL_TEMPLATES_PATH);
    // console.log('============%%%%%%%%%========================');
    const newPath = MAIL_TEMPLATES_PATH.replace('/src/', '/');
    return path.resolve(newPath, ...templatePath.split("/"))
}
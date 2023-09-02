import { Type, Platform, EntityProperty } from '@mikro-orm/core';

export class DateType extends Type<any> {

    convertToJSValue(date) {
        return (date as Date).toISOString().substr(0, 19).replace('T', ' ');
    }

    getColumnType(prop: EntityProperty, platform: Platform) {
        return `date(${prop.length})`;
    }

}

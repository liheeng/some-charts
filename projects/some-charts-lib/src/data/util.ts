import { Sorting } from "../sorting";

export class Util {
    public static getCompareFunc<ValueType extends number | string | Date>(
        sorting: Sorting = Sorting.None,
    ): (left: ValueType, right: ValueType) => number {
        return function (
            left: ValueType,
            right: ValueType,
        ): number {

            if (sorting === Sorting.None) {
                return 0;
            } else {
                if (left > right) {
                    return sorting === Sorting.Asc ? 1 : -1;
                } else if (left < right) {
                    return sorting === Sorting.Asc ? -1 : 1;
                } else return 0;
            }
        };
    }

}
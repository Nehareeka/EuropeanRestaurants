import { Component, OnInit, Input } from '@angular/core';
import { SortDirective } from '../directives/sort.directive';
import { ActivatedRoute } from '@angular/router';
import { PagerService } from 'src/app/shared/pager.service';

@Component({
    selector: 'restaurant-list',
    templateUrl: 'restaurant.component.html',
    styleUrls: ['restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
    @Input() name: string;

    constructor(private _pagerService: PagerService, private route: ActivatedRoute) { }

    filteredProducts = [];
    restaurants: any;
    public columns: Array<any> = [];

    headers = [];

    public config: any;
    // paged items
    pagedItems: any;
    // pager object
    pager: any = {};

    ngOnInit(): void {
        var data = this.route.snapshot.data['initData'];
        var arrayData = this.CSVToArray(data, ",");
        this.restaurants = this.csvJSON(arrayData);
        this.setPage(1);
        this.initTable();
    }

    setPage(page: number, data: any = this.restaurants) {
        // get pager object from service
        this.pager = this._pagerService.getPager(data.length, page);

        // get current page of items
        this.pagedItems = data.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    public csvJSON(csv) {
        var result = [];
        csv[0].forEach(h => {
            this.headers.push(h.replace(/ /g, ""));
        });
        for (var i = 1; i < csv.length; i++) {
            var obj = {};
            for (var j = 0; j < this.headers.length; j++) {
                if (this.headers[j] === "CuisineStyle") {
                    if (csv[i][j]) {
                        obj[this.headers[j]] = csv[i][j].replace(/([\[\]\'])+/g, "");
                    }
                }
                else obj[this.headers[j]] = csv[i][j];
            }
            result.push(obj);
        }
        return result;
    }

    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
            ) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );
            } else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    }

    performFilter(filterBy: string) {
        filterBy = filterBy.toLocaleLowerCase();
        return this.restaurants.filter((r) =>
            r.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }


    initTable() {
        this.headers.forEach((item: string) => {
            if (item === "CuisineStyle") {
                this.columns.push({
                    title: item, sort: false,
                    filtering: { filterString: '', placeholder: 'Filter by ' + item }
                });
            }
            else if (item == "Name") {
                this.columns.push({
                    title: item, sort: '',
                    filtering: { filterString: '', placeholder: 'Filter by ' + item }
                });
            }
            else {
                this.columns.push({ title: item, sort: '' });
            }
        });
        this.config = {
            sorting: { columns: this.columns },
            filtering: { filterString: '' }
        };
    }

    public get configColumns(): any {
        let sortColumns: Array<any> = [];

        this.columns.forEach((column: any) => {
            if (column.sort) {
                sortColumns.push(column);
            }
        });

        return { columns: sortColumns };
    }

    public changeFilter(data: any, config: any): any {
        let filteredData: Array<any> = data;
        this.columns.forEach((column: any) => {
            if (column.filtering) {
                filteredData = filteredData.filter((item: any) => {
                    if (item[column.title])
                        return item[column.title].toString().match(column.filtering.filterString);
                });
            }
        });

        if (!config.filtering) {
            return filteredData;
        }

        if (config.filtering.columnName) {
            return filteredData.filter((item: any) =>
                item[config.filtering.columnName].match(this.config.filtering.filterString));
        }

        let tempArray: Array<any> = [];
        filteredData.forEach((item: any) => {
            let flag = false;
            this.columns.forEach((column: any) => {
                if (item[column.title].toString().match(this.config.filtering.filterString)) {
                    flag = true;
                }
            });
            if (flag) {
                tempArray.push(item);
            }
        });
        filteredData = tempArray;

        return filteredData;
    }

    public changeSort(data: any, config: any): any {
        if (!config.sorting) {
            return data;
        }

        let columns = this.config.sorting.columns || [];
        let columnName: string = void 0;
        let sort: string = void 0;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].title;
                sort = columns[i].sort;
            }
        }

        if (!columnName) {
            return data;
        }

        // simple sorting
        return data.sort((previous: any, current: any) => {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            } else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }

    public onChangeTable(column: any): void {
        this.columns.forEach((col: any) => {
            if (col.title !== column.title) {
                col.sort = '';
            }
        });
        this.tableChanged({ sorting: this.configColumns });
    }

    public tableChanged(config: any) {
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }
        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }
        let filteredData = this.changeFilter(this.restaurants, this.config);
        // let data = this.moviesInfo.slice(0);
        let sortedData = this.changeSort(filteredData, this.config);
        this.setPage(1, sortedData);
    }
}

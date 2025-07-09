import {
  c as createLucideIcon,
  a as useRouter,
  r as reactExports,
  j as jsxRuntimeExports,
  B as Button,
  I as Input,
  S as Select,
  K as SelectTrigger,
  L as SelectValue,
  M as SelectContent,
  N as SelectItem,
  T as Card,
  $ as CardHeader,
  a1 as CardTitle,
  a2 as CardDescription,
  _ as CardContent,
  b as Badge,
  a5 as Label,
  Q as Switch,
  a6 as Check,
} from "./main-D54NVj6U.js";
import {
  A as Avatar,
  a as AvatarImage,
  b as AvatarFallback,
} from "./avatar-DaWuUHOH.js";
import {
  D as DropdownMenu,
  a as DropdownMenuTrigger,
  b as DropdownMenuContent,
  e as DropdownMenuItem,
  d as DropdownMenuSeparator,
} from "./dropdown-menu-Cc3wlmA0.js";
import {
  T as Table,
  a as TableHeader,
  b as TableRow,
  c as TableHead,
  d as TableBody,
  e as TableCell,
} from "./table-DDJ6ebWY.js";
import {
  D as Dialog,
  a as DialogContent,
  b as DialogHeader,
  c as DialogTitle,
  d as DialogDescription,
  e as DialogFooter,
} from "./dialog-DgPdtaM4.js";
import {
  T as Tabs,
  a as TabsList,
  b as TabsTrigger,
  c as TabsContent,
} from "./tabs-DWHFZA6o.js";
import {
  g as getAllUsers,
  a as availablePermissions,
  U as UserCog,
} from "./user-data-D8whqKuv.js";
import { u as useToast } from "./use-toast-nfgjIcjL.js";
import { S as Search } from "./search-BS6yzFHd.js";
import { F as Filter } from "./filter-CxrQxdgK.js";
import {
  t as toDate,
  c as constructFrom,
  n as normalizeDates,
  g as getTimezoneOffsetInMilliseconds,
  a as getDefaultOptions,
  e as enUS,
  m as minutesInDay,
  b as minutesInMonth,
  f as format,
} from "./format-DdtoHLaj.js";
import {
  e as endOfMonth,
  d as differenceInCalendarMonths,
} from "./endOfMonth-Dv1-wySt.js";
import { E as Ellipsis } from "./ellipsis-pC1tMovR.js";
import { T as Trash2 } from "./trash-2-N6yWrD4G.js";
import { S as Shield } from "./shield-BJrRhV_W.js";
import "./index-DACOVT_t.js";
import "./chevron-right-VQ7fFc8Y.js";
import "./index-B18GAnIN.js";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const ArrowUpDown = createLucideIcon("ArrowUpDown", [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const ShieldAlert = createLucideIcon("ShieldAlert", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y",
    },
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const ShieldCheck = createLucideIcon("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y",
    },
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const ShieldQuestion = createLucideIcon("ShieldQuestion", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y",
    },
  ],
  ["path", { d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3", key: "mhlwft" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const UserPlus = createLucideIcon("UserPlus", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }],
]);

/**
 * @name compareAsc
 * @category Common Helpers
 * @summary Compare the two dates and return -1, 0 or 1.
 *
 * @description
 * Compare the two dates and return 1 if the first date is after the second,
 * -1 if the first date is before the second or 0 if dates are equal.
 *
 * @param dateLeft - The first date to compare
 * @param dateRight - The second date to compare
 *
 * @returns The result of the comparison
 *
 * @example
 * // Compare 11 February 1987 and 10 July 1989:
 * const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
 * //=> -1
 *
 * @example
 * // Sort the array of dates:
 * const result = [
 *   new Date(1995, 6, 2),
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * ].sort(compareAsc)
 * //=> [
 * //   Wed Feb 11 1987 00:00:00,
 * //   Mon Jul 10 1989 00:00:00,
 * //   Sun Jul 02 1995 00:00:00
 * // ]
 */
function compareAsc(dateLeft, dateRight) {
  const diff = +toDate(dateLeft) - +toDate(dateRight);

  if (diff < 0) return -1;
  else if (diff > 0) return 1;

  // Return 0 if diff is 0; return NaN if diff is NaN
  return diff;
}

/**
 * @name constructNow
 * @category Generic Helpers
 * @summary Constructs a new current date using the passed value constructor.
 * @pure false
 *
 * @description
 * The function constructs a new current date using the constructor from
 * the reference date. It helps to build generic functions that accept date
 * extensions and use the current date.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * @param date - The reference date to take constructor from
 *
 * @returns Current date initialized using the given date constructor
 *
 * @example
 * import { constructNow, isSameDay } from 'date-fns'
 *
 * function isToday<DateType extends Date>(
 *   date: DateArg<DateType>,
 * ): boolean {
 *   // If we were to use `new Date()` directly, the function would  behave
 *   // differently in different timezones and return false for the same date.
 *   return isSameDay(date, constructNow(date));
 * }
 */
function constructNow(date) {
  return constructFrom(date, Date.now());
}

function getRoundingMethod(method) {
  return (number) => {
    const round = method ? Math[method] : Math.trunc;
    const result = round(number);
    // Prevent negative zero
    return result === 0 ? 0 : result;
  };
}

/**
 * @name differenceInMilliseconds
 * @category Millisecond Helpers
 * @summary Get the number of milliseconds between the given dates.
 *
 * @description
 * Get the number of milliseconds between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 *
 * @returns The number of milliseconds
 *
 * @example
 * // How many milliseconds are between
 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
 * const result = differenceInMilliseconds(
 *   new Date(2014, 6, 2, 12, 30, 21, 700),
 *   new Date(2014, 6, 2, 12, 30, 20, 600)
 * )
 * //=> 1100
 */
function differenceInMilliseconds(laterDate, earlierDate) {
  return +toDate(laterDate) - +toDate(earlierDate);
}

/**
 * The {@link endOfDay} function options.
 */

/**
 * @name endOfDay
 * @category Day Helpers
 * @summary Return the end of a day for the given date.
 *
 * @description
 * Return the end of a day for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The end of a day
 *
 * @example
 * // The end of a day for 2 September 2014 11:55:00:
 * const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 23:59:59.999
 */
function endOfDay(date, options) {
  const _date = toDate(date, options?.in);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

/**
 * @name isLastDayOfMonth
 * @category Month Helpers
 * @summary Is the given date the last day of a month?
 *
 * @description
 * Is the given date the last day of a month?
 *
 * @param date - The date to check
 * @param options - An object with options
 *
 * @returns The date is the last day of a month
 *
 * @example
 * // Is 28 February 2014 the last day of a month?
 * const result = isLastDayOfMonth(new Date(2014, 1, 28))
 * //=> true
 */
function isLastDayOfMonth(date, options) {
  const _date = toDate(date, options?.in);
  return +endOfDay(_date, options) === +endOfMonth(_date, options);
}

/**
 * The {@link differenceInMonths} function options.
 */

/**
 * @name differenceInMonths
 * @category Month Helpers
 * @summary Get the number of full months between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options
 *
 * @returns The number of full months
 *
 * @example
 * // How many full months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))
 * //=> 7
 */
function differenceInMonths(laterDate, earlierDate, options) {
  const [laterDate_, workingLaterDate, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    laterDate,
    earlierDate,
  );

  const sign = compareAsc(workingLaterDate, earlierDate_);
  const difference = Math.abs(
    differenceInCalendarMonths(workingLaterDate, earlierDate_),
  );

  if (difference < 1) return 0;

  if (workingLaterDate.getMonth() === 1 && workingLaterDate.getDate() > 27)
    workingLaterDate.setDate(30);

  workingLaterDate.setMonth(workingLaterDate.getMonth() - sign * difference);

  let isLastMonthNotFull = compareAsc(workingLaterDate, earlierDate_) === -sign;

  if (
    isLastDayOfMonth(laterDate_) &&
    difference === 1 &&
    compareAsc(laterDate_, earlierDate_) === 1
  ) {
    isLastMonthNotFull = false;
  }

  const result = sign * (difference - +isLastMonthNotFull);
  return result === 0 ? 0 : result;
}

/**
 * The {@link differenceInSeconds} function options.
 */

/**
 * @name differenceInSeconds
 * @category Second Helpers
 * @summary Get the number of seconds between the given dates.
 *
 * @description
 * Get the number of seconds between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options.
 *
 * @returns The number of seconds
 *
 * @example
 * // How many seconds are between
 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
 * const result = differenceInSeconds(
 *   new Date(2014, 6, 2, 12, 30, 20, 0),
 *   new Date(2014, 6, 2, 12, 30, 7, 999)
 * )
 * //=> 12
 */
function differenceInSeconds(laterDate, earlierDate, options) {
  const diff = differenceInMilliseconds(laterDate, earlierDate) / 1000;
  return getRoundingMethod(options?.roundingMethod)(diff);
}

/**
 * The {@link formatDistance} function options.
 */

/**
 * @name formatDistance
 * @category Common Helpers
 * @summary Return the distance between the given dates in words.
 *
 * @description
 * Return the distance between the given dates in words.
 *
 * | Distance between dates                                            | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance between dates | Result               |
 * |------------------------|----------------------|
 * | 0 secs ... 5 secs      | less than 5 seconds  |
 * | 5 secs ... 10 secs     | less than 10 seconds |
 * | 10 secs ... 20 secs    | less than 20 seconds |
 * | 20 secs ... 40 secs    | half a minute        |
 * | 40 secs ... 60 secs    | less than a minute   |
 * | 60 secs ... 90 secs    | 1 minute             |
 *
 * @param laterDate - The date
 * @param earlierDate - The date to compare with
 * @param options - An object with options
 *
 * @returns The distance in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `baseDate` must not be Invalid Date
 * @throws `options.locale` must contain `formatDistance` property
 *
 * @example
 * // What is the distance between 2 July 2014 and 1 January 2015?
 * const result = formatDistance(new Date(2014, 6, 2), new Date(2015, 0, 1))
 * //=> '6 months'
 *
 * @example
 * // What is the distance between 1 January 2015 00:00:15
 * // and 1 January 2015 00:00:00, including seconds?
 * const result = formatDistance(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   new Date(2015, 0, 1, 0, 0, 0),
 *   { includeSeconds: true }
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 1 January 2015, with a suffix?
 * const result = formatDistance(new Date(2015, 0, 1), new Date(2016, 0, 1), {
 *   addSuffix: true
 * })
 * //=> 'about 1 year ago'
 *
 * @example
 * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = formatDistance(new Date(2016, 7, 1), new Date(2015, 0, 1), {
 *   locale: eoLocale
 * })
 * //=> 'pli ol 1 jaro'
 */
function formatDistance(laterDate, earlierDate, options) {
  const defaultOptions = getDefaultOptions();
  const locale = options?.locale ?? defaultOptions.locale ?? enUS;
  const minutesInAlmostTwoDays = 2520;

  const comparison = compareAsc(laterDate, earlierDate);

  if (isNaN(comparison)) throw new RangeError("Invalid time value");

  const localizeOptions = Object.assign({}, options, {
    addSuffix: options?.addSuffix,
    comparison: comparison,
  });

  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    ...(comparison > 0 ? [earlierDate, laterDate] : [laterDate, earlierDate]),
  );

  const seconds = differenceInSeconds(earlierDate_, laterDate_);
  const offsetInSeconds =
    (getTimezoneOffsetInMilliseconds(earlierDate_) -
      getTimezoneOffsetInMilliseconds(laterDate_)) /
    1000;
  const minutes = Math.round((seconds - offsetInSeconds) / 60);
  let months;

  // 0 up to 2 mins
  if (minutes < 2) {
    if (options?.includeSeconds) {
      if (seconds < 5) {
        return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
      } else if (seconds < 10) {
        return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
      } else if (seconds < 20) {
        return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
      } else if (seconds < 40) {
        return locale.formatDistance("halfAMinute", 0, localizeOptions);
      } else if (seconds < 60) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", minutes, localizeOptions);
      }
    }

    // 2 mins up to 0.75 hrs
  } else if (minutes < 45) {
    return locale.formatDistance("xMinutes", minutes, localizeOptions);

    // 0.75 hrs up to 1.5 hrs
  } else if (minutes < 90) {
    return locale.formatDistance("aboutXHours", 1, localizeOptions);

    // 1.5 hrs up to 24 hrs
  } else if (minutes < minutesInDay) {
    const hours = Math.round(minutes / 60);
    return locale.formatDistance("aboutXHours", hours, localizeOptions);

    // 1 day up to 1.75 days
  } else if (minutes < minutesInAlmostTwoDays) {
    return locale.formatDistance("xDays", 1, localizeOptions);

    // 1.75 days up to 30 days
  } else if (minutes < minutesInMonth) {
    const days = Math.round(minutes / minutesInDay);
    return locale.formatDistance("xDays", days, localizeOptions);

    // 1 month up to 2 months
  } else if (minutes < minutesInMonth * 2) {
    months = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("aboutXMonths", months, localizeOptions);
  }

  months = differenceInMonths(earlierDate_, laterDate_);

  // 2 months up to 12 months
  if (months < 12) {
    const nearestMonth = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("xMonths", nearestMonth, localizeOptions);

    // 1 year up to max Date
  } else {
    const monthsSinceStartOfYear = months % 12;
    const years = Math.trunc(months / 12);

    // N years up to 1 years 3 months
    if (monthsSinceStartOfYear < 3) {
      return locale.formatDistance("aboutXYears", years, localizeOptions);

      // N years 3 months up to N years 9 months
    } else if (monthsSinceStartOfYear < 9) {
      return locale.formatDistance("overXYears", years, localizeOptions);

      // N years 9 months up to N year 12 months
    } else {
      return locale.formatDistance("almostXYears", years + 1, localizeOptions);
    }
  }
}

/**
 * The {@link formatDistanceToNow} function options.
 */

/**
 * @name formatDistanceToNow
 * @category Common Helpers
 * @summary Return the distance between the given date and now in words.
 * @pure false
 *
 * @description
 * Return the distance between the given date and now in words.
 *
 * | Distance to now                                                   | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance to now     | Result               |
 * |---------------------|----------------------|
 * | 0 secs ... 5 secs   | less than 5 seconds  |
 * | 5 secs ... 10 secs  | less than 10 seconds |
 * | 10 secs ... 20 secs | less than 20 seconds |
 * | 20 secs ... 40 secs | half a minute        |
 * | 40 secs ... 60 secs | less than a minute   |
 * | 60 secs ... 90 secs | 1 minute             |
 *
 * @param date - The given date
 * @param options - The object with options
 *
 * @returns The distance in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `options.locale` must contain `formatDistance` property
 *
 * @example
 * // If today is 1 January 2015, what is the distance to 2 July 2014?
 * const result = formatDistanceToNow(
 *   new Date(2014, 6, 2)
 * )
 * //=> '6 months'
 *
 * @example
 * // If now is 1 January 2015 00:00:00,
 * // what is the distance to 1 January 2015 00:00:15, including seconds?
 * const result = formatDistanceToNow(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   {includeSeconds: true}
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 January 2016, with a suffix?
 * const result = formatDistanceToNow(
 *   new Date(2016, 0, 1),
 *   {addSuffix: true}
 * )
 * //=> 'in about 1 year'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 August 2016 in Esperanto?
 * const eoLocale = require('date-fns/locale/eo')
 * const result = formatDistanceToNow(
 *   new Date(2016, 7, 1),
 *   {locale: eoLocale}
 * )
 * //=> 'pli ol 1 jaro'
 */
function formatDistanceToNow(date, options) {
  return formatDistance(date, constructNow(date), options);
}

function Checkbox(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: "flex items-center",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
      type: "checkbox",
      className:
        "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
      ...props,
    }),
  });
}
const SplitComponent = function UsersPage() {
  useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterRole, setFilterRole] = reactExports.useState(null);
  const [filterStatus, setFilterStatus] = reactExports.useState(null);
  const [sortBy, setSortBy] = reactExports.useState("lastActive");
  const [sortOrder, setSortOrder] = reactExports.useState("desc");
  const [isAddUserOpen, setIsAddUserOpen] = reactExports.useState(false);
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [isEditUserOpen, setIsEditUserOpen] = reactExports.useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = reactExports.useState(false);
  const allUsers = getAllUsers();
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "role") {
      comparison = a.role.localeCompare(b.role);
    } else if (sortBy === "lastActive") {
      comparison =
        new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const handleAddUser = () => {
    toast({
      title: "User Added",
      description: "The new user has been added successfully.",
    });
    setIsAddUserOpen(false);
  };
  const handleEditUser = () => {
    if (!selectedUser) return;
    toast({
      title: "User Updated",
      description: `${selectedUser.name}'s information has been updated.`,
    });
    setIsEditUserOpen(false);
  };
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    toast({
      title: "User Deleted",
      description: `${selectedUser.name} has been removed from the platform.`,
      variant: "destructive",
    });
    setIsDeleteUserOpen(false);
  };
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "destructive";
      case "manager":
        return "purple";
      case "support":
        return "blue";
      case "analyst":
        return "green";
      default:
        return "secondary";
    }
  };
  const getRoleIcon = (role) => {
    switch (role) {
      case "owner":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, {
          className: "h-4 w-4",
        });
      case "admin":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, {
          className: "h-4 w-4",
        });
      case "manager":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, {
          className: "h-4 w-4",
        });
      case "support":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, {
          className: "h-4 w-4",
        });
      case "analyst":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldQuestion, {
          className: "h-4 w-4",
        });
      default:
        return null;
    }
  };
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "container mx-auto py-8",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                className: "text-3xl font-bold",
                children: "User Management",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-muted-foreground",
                children: "Manage user accounts and permissions",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
            onClick: () => setIsAddUserOpen(true),
            className: "gap-2 rounded-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, {
                className: "h-4 w-4",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                children: "Add User",
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "mb-6 flex flex-col gap-4 md:flex-row",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "relative flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                className:
                  "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                placeholder: "Search users...",
                className: "pl-9",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                value: filterRole || "all",
                onValueChange: (value) =>
                  setFilterRole(value === "all" ? null : value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, {
                    className: "w-[150px] gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {
                        placeholder: "All Roles",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "all",
                        children: "All Roles",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "owner",
                        children: "Owner",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "admin",
                        children: "Admin",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "manager",
                        children: "Manager",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "support",
                        children: "Support",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "analyst",
                        children: "Analyst",
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                value: filterStatus || "all",
                onValueChange: (value) =>
                  setFilterStatus(value === "all" ? null : value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, {
                    className: "w-[150px] gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {
                        placeholder: "All Statuses",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "all",
                        children: "All Statuses",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "active",
                        children: "Active",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "inactive",
                        children: "Inactive",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "pending",
                        children: "Pending",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, {
            className: "p-4",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                  children: "Platform Users",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, {
                  children: [sortedUsers.length, " users total"],
                }),
              ],
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, {
            className: "p-0",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, {
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                        className: "w-[250px]",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            variant: "ghost",
                            className: "gap-1 p-0 hover:bg-transparent",
                            onClick: () => handleSort("name"),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                children: "Name",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                ArrowUpDown,
                                { className: "h-3 w-3" },
                              ),
                            ],
                          },
                        ),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                        children: "Email",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            variant: "ghost",
                            className: "gap-1 p-0 hover:bg-transparent",
                            onClick: () => handleSort("role"),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                children: "Role",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                ArrowUpDown,
                                { className: "h-3 w-3" },
                              ),
                            ],
                          },
                        ),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                        children: "Status",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            variant: "ghost",
                            className: "gap-1 p-0 hover:bg-transparent",
                            onClick: () => handleSort("lastActive"),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                children: "Last Active",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                ArrowUpDown,
                                { className: "h-3 w-3" },
                              ),
                            ],
                          },
                        ),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                        className: "text-right",
                        children: "Actions",
                      }),
                    ],
                  }),
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, {
                  children:
                    sortedUsers.length === 0
                      ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            TableCell,
                            {
                              colSpan: 6,
                              className: "h-24 text-center",
                              children: "No users found.",
                            },
                          ),
                        })
                      : sortedUsers.map((user) =>
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            TableRow,
                            {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  TableCell,
                                  {
                                    className: "font-medium",
                                    children:
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                        "div",
                                        {
                                          className: "flex items-center gap-3",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              Avatar,
                                              {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    AvatarImage,
                                                    {
                                                      src:
                                                        user.avatar ||
                                                        "/abstract-profile.png",
                                                      alt: user.name,
                                                    },
                                                  ),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    AvatarFallback,
                                                    {
                                                      children:
                                                        user.name.charAt(0),
                                                    },
                                                  ),
                                                ],
                                              },
                                            ),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              "div",
                                              {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    "div",
                                                    {
                                                      className: "font-medium",
                                                      children: user.name,
                                                    },
                                                  ),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                    "div",
                                                    {
                                                      className:
                                                        "text-xs text-muted-foreground",
                                                      children: [
                                                        "Created",
                                                        " ",
                                                        format(
                                                          new Date(
                                                            user.createdAt,
                                                          ),
                                                          "MMM d, yyyy",
                                                        ),
                                                      ],
                                                    },
                                                  ),
                                                ],
                                              },
                                            ),
                                          ],
                                        },
                                      ),
                                  },
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  TableCell,
                                  { children: user.email },
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  TableCell,
                                  {
                                    children:
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                        Badge,
                                        {
                                          variant: getRoleBadgeVariant(
                                            user.role,
                                          ),
                                          className: "gap-1",
                                          children: [
                                            getRoleIcon(user.role),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              "span",
                                              {
                                                children:
                                                  user.role
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                  user.role.slice(1),
                                              },
                                            ),
                                          ],
                                        },
                                      ),
                                  },
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  TableCell,
                                  {
                                    children:
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        Badge,
                                        {
                                          variant: getStatusBadgeVariant(
                                            user.status,
                                          ),
                                          children:
                                            user.status
                                              .charAt(0)
                                              .toUpperCase() +
                                            user.status.slice(1),
                                        },
                                      ),
                                  },
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  TableCell,
                                  {
                                    children: formatDistanceToNow(
                                      new Date(user.lastActive),
                                      {
                                        addSuffix: true,
                                      },
                                    ),
                                  },
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  TableCell,
                                  {
                                    className: "text-right",
                                    children:
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                        DropdownMenu,
                                        {
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              DropdownMenuTrigger,
                                              {
                                                asChild: true,
                                                children:
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    Button,
                                                    {
                                                      variant: "ghost",
                                                      size: "icon",
                                                      className:
                                                        "h-8 w-8 rounded-full",
                                                      children:
                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          Ellipsis,
                                                          {
                                                            className:
                                                              "h-4 w-4",
                                                          },
                                                        ),
                                                    },
                                                  ),
                                              },
                                            ),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              DropdownMenuContent,
                                              {
                                                align: "end",
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    DropdownMenuItem,
                                                    {
                                                      onClick: () => {
                                                        setSelectedUser(user);
                                                        setIsEditUserOpen(true);
                                                      },
                                                      children: "Edit User",
                                                    },
                                                  ),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    DropdownMenuItem,
                                                    {
                                                      children:
                                                        "View Activity Log",
                                                    },
                                                  ),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    DropdownMenuItem,
                                                    {
                                                      children:
                                                        "Reset Password",
                                                    },
                                                  ),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    DropdownMenuSeparator,
                                                    {},
                                                  ),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                    DropdownMenuItem,
                                                    {
                                                      onClick: () => {
                                                        setSelectedUser(user);
                                                        setIsDeleteUserOpen(
                                                          true,
                                                        );
                                                      },
                                                      className:
                                                        "text-destructive focus:text-destructive",
                                                      children: [
                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          Trash2,
                                                          {
                                                            className:
                                                              "mr-2 h-4 w-4",
                                                          },
                                                        ),
                                                        "Delete User",
                                                      ],
                                                    },
                                                  ),
                                                ],
                                              },
                                            ),
                                          ],
                                        },
                                      ),
                                  },
                                ),
                              ],
                            },
                            user.id,
                          ),
                        ),
                }),
              ],
            }),
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, {
        open: isAddUserOpen,
        onOpenChange: setIsAddUserOpen,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, {
          className: "max-h-[90vh] overflow-y-auto sm:max-w-[600px]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, {
                  children: "Add New User",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, {
                  children:
                    "Create a new user account and set their permissions.",
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "grid gap-4 py-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "grid grid-cols-2 gap-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                          htmlFor: "name",
                          children: "Full Name",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                          id: "name",
                          placeholder: "Enter full name",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                          htmlFor: "email",
                          children: "Email Address",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                          id: "email",
                          type: "email",
                          placeholder: "Enter email address",
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "grid grid-cols-2 gap-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                          htmlFor: "role",
                          children: "Role",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                          defaultValue: "support",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectTrigger,
                              {
                                id: "role",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SelectValue,
                                  { placeholder: "Select role" },
                                ),
                              },
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              SelectContent,
                              {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    SelectItem,
                                    { value: "admin", children: "Admin" },
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    SelectItem,
                                    { value: "manager", children: "Manager" },
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    SelectItem,
                                    { value: "support", children: "Support" },
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    SelectItem,
                                    { value: "analyst", children: "Analyst" },
                                  ),
                                ],
                              },
                            ),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                          htmlFor: "status",
                          children: "Status",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                          defaultValue: "pending",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectTrigger,
                              {
                                id: "status",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SelectValue,
                                  { placeholder: "Select status" },
                                ),
                              },
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              SelectContent,
                              {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    SelectItem,
                                    { value: "active", children: "Active" },
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    SelectItem,
                                    { value: "inactive", children: "Inactive" },
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    SelectItem,
                                    { value: "pending", children: "Pending" },
                                  ),
                                ],
                              },
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                      children: "Security Settings",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "rounded-md border p-4",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "flex items-center justify-between space-y-0",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "space-y-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                                htmlFor: "two-factor",
                                children: "Two-factor Authentication",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "text-sm text-muted-foreground",
                                children:
                                  "Require two-factor authentication for this user",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {
                            id: "two-factor",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                      children: "Permissions",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, {
                      defaultValue: "preset",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, {
                          className: "grid w-full grid-cols-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, {
                              value: "preset",
                              children: "Role Presets",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, {
                              value: "custom",
                              children: "Custom Permissions",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
                          value: "preset",
                          className: "space-y-4 pt-4",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-sm text-muted-foreground",
                            children:
                              "This user will have all permissions associated with the selected role.",
                          }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
                          value: "custom",
                          className: "space-y-4 pt-4",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "grid gap-2",
                              children: availablePermissions.map((permission) =>
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "div",
                                  {
                                    className: "flex items-center space-x-2",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        Checkbox,
                                        { id: `permission-${permission.id}` },
                                      ),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                        "div",
                                        {
                                          className:
                                            "grid gap-1.5 leading-none",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              Label,
                                              {
                                                htmlFor: `permission-${permission.id}`,
                                                className:
                                                  "text-sm font-medium",
                                                children: permission.name,
                                              },
                                            ),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              "p",
                                              {
                                                className:
                                                  "text-xs text-muted-foreground",
                                                children:
                                                  permission.description,
                                              },
                                            ),
                                          ],
                                        },
                                      ),
                                    ],
                                  },
                                  permission.id,
                                ),
                              ),
                            },
                          ),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                  variant: "outline",
                  onClick: () => setIsAddUserOpen(false),
                  children: "Cancel",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                  onClick: handleAddUser,
                  children: "Add User",
                }),
              ],
            }),
          ],
        }),
      }),
      selectedUser &&
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, {
          open: isEditUserOpen,
          onOpenChange: setIsEditUserOpen,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, {
            className: "max-h-[90vh] overflow-y-auto sm:max-w-[600px]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, {
                    children: "Edit User",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, {
                    children: "Update user information and permissions.",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid gap-4 py-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex items-center gap-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, {
                        className: "h-16 w-16",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, {
                            src: selectedUser.avatar || "/abstract-profile.png",
                            alt: selectedUser.name,
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            AvatarFallback,
                            { children: selectedUser.name.charAt(0) },
                          ),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                            className: "text-lg font-medium",
                            children: selectedUser.name,
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-sm text-muted-foreground",
                            children: selectedUser.email,
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "grid grid-cols-2 gap-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                            htmlFor: "edit-name",
                            children: "Full Name",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                            id: "edit-name",
                            defaultValue: selectedUser.name,
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                            htmlFor: "edit-email",
                            children: "Email Address",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                            id: "edit-email",
                            type: "email",
                            defaultValue: selectedUser.email,
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "grid grid-cols-2 gap-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                            htmlFor: "edit-role",
                            children: "Role",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                            defaultValue: selectedUser.role,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                SelectTrigger,
                                {
                                  id: "edit-role",
                                  children:
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectValue,
                                      { placeholder: "Select role" },
                                    ),
                                },
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                SelectContent,
                                {
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectItem,
                                      { value: "owner", children: "Owner" },
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectItem,
                                      { value: "admin", children: "Admin" },
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectItem,
                                      { value: "manager", children: "Manager" },
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectItem,
                                      { value: "support", children: "Support" },
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectItem,
                                      { value: "analyst", children: "Analyst" },
                                    ),
                                  ],
                                },
                              ),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                            htmlFor: "edit-status",
                            children: "Status",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                            defaultValue: selectedUser.status,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                SelectTrigger,
                                {
                                  id: "edit-status",
                                  children:
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectValue,
                                      { placeholder: "Select status" },
                                    ),
                                },
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                SelectContent,
                                {
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectItem,
                                      { value: "active", children: "Active" },
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectItem,
                                      {
                                        value: "inactive",
                                        children: "Inactive",
                                      },
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectItem,
                                      { value: "pending", children: "Pending" },
                                    ),
                                  ],
                                },
                              ),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                        children: "Security Settings",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "rounded-md border p-4",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className:
                              "flex items-center justify-between space-y-0",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "space-y-0.5",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                                    htmlFor: "edit-two-factor",
                                    children: "Two-factor Authentication",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "text-sm text-muted-foreground",
                                    children:
                                      "Require two-factor authentication for this user",
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {
                                id: "edit-two-factor",
                                defaultChecked: selectedUser.twoFactorEnabled,
                              }),
                            ],
                          },
                        ),
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                            children: "Permissions",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                            variant: "outline",
                            size: "sm",
                            className: "gap-1 text-xs",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, {
                                className: "h-3 w-3",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                children: "Reset to Role Default",
                              }),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className:
                          "max-h-[200px] overflow-y-auto rounded-md border p-4",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "grid gap-2",
                          children: availablePermissions.map((permission) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "div",
                              {
                                className: "flex items-center space-x-2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    Checkbox,
                                    {
                                      id: `edit-permission-${permission.id}`,
                                      defaultChecked:
                                        selectedUser.permissions.includes(
                                          permission.id,
                                        ),
                                    },
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "div",
                                    {
                                      className: "grid gap-1.5 leading-none",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          Label,
                                          {
                                            htmlFor: `edit-permission-${permission.id}`,
                                            className: "text-sm font-medium",
                                            children: permission.name,
                                          },
                                        ),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          "p",
                                          {
                                            className:
                                              "text-xs text-muted-foreground",
                                            children: permission.description,
                                          },
                                        ),
                                      ],
                                    },
                                  ),
                                ],
                              },
                              permission.id,
                            ),
                          ),
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                    variant: "outline",
                    onClick: () => setIsEditUserOpen(false),
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                    onClick: handleEditUser,
                    children: "Save Changes",
                  }),
                ],
              }),
            ],
          }),
        }),
      selectedUser &&
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, {
          open: isDeleteUserOpen,
          onOpenChange: setIsDeleteUserOpen,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, {
                    children: "Delete User",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, {
                    children:
                      "Are you sure you want to delete this user? This action cannot be undone.",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex items-center gap-4 py-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, {
                        src: selectedUser.avatar || "/abstract-profile.png",
                        alt: selectedUser.name,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, {
                        children: selectedUser.name.charAt(0),
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                        className: "font-medium",
                        children: selectedUser.name,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-sm text-muted-foreground",
                        children: selectedUser.email,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, {
                        variant: getRoleBadgeVariant(selectedUser.role),
                        className: "mt-1 gap-1",
                        children: [
                          getRoleIcon(selectedUser.role),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            children:
                              selectedUser.role.charAt(0).toUpperCase() +
                              selectedUser.role.slice(1),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                    variant: "outline",
                    onClick: () => setIsDeleteUserOpen(false),
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                    variant: "destructive",
                    onClick: handleDeleteUser,
                    children: "Delete User",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
};

export { SplitComponent as component };

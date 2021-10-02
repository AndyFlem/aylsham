import Vue from 'vue'
import { DateTime } from 'luxon'
import {format} from 'd3'
import helpers from '@/services/helpers'

Vue.mixin({
  methods: {
    chkStr (val) {
      return val ? val + ' ' : ''
    },
    camelize (str) {
      const regex = /-(\w)/g
      return str.replace(regex, (_, c) => (c ? c.toUpperCase() : ''))
    },
    formatM (val) {
      if (!isNaN(parseFloat(val))) {
        return (val < 0 ? '(' : '') + Vue.prototype.$config.MONEY_SYMBOL + format(',.2f')(Math.abs(val)) + (val < 0 ? ')' : '')
      } else {
        return Vue.prototype.$config.MONEY_SYMBOL + ' -'
      }
    },
    formatDollar (val) {
      if (!isNaN(parseFloat(val))) {
        return '$' + format(',.0f')(val)
      } else {
        return '$ -'
      }
    },
    formatMInt (val) {
      if (!isNaN(parseFloat(val))) {
        return (val < 0 ? '(' : '') + Vue.prototype.$config.MONEY_SYMBOL + format(',.0f')(Math.abs(val)) + (val < 0 ? ')' : '')
      } else {
        return Vue.prototype.$config.MONEY_SYMBOL + ' -'
      }
    },
    formatInt (val) {
      if (!isNaN(parseFloat(val))) {
        return format(',.0f')(val)
      } else {
        return '-'
      }
    },
    formatDec (val) {
      if (!isNaN(parseFloat(val))) {
        if (parseFloat(val) < 5) {
          if (parseFloat(val) < 2) {
            return format(',.2f')(val)
          } else {
            return format(',.1f')(val)
          }
        } else {
          return format(',.0f')(val)
        }
      } else {
        return '-'
      }
    },
    formatT (val) {
      return DateTime.fromISO(val).toLocaleString(DateTime.DATETIME_MED)
    },
    formatD (val) {
      if (val) {
        return DateTime.fromISO(val).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      } else {
        return 'not set'
      }
    },
    formatDShort (val) {
      if (val) {
        return DateTime.fromISO(val).toFormat('d LLL yy')
      } else {
        return 'not set'
      }
    },
    formatD2 (val) {
      if (val) {
        return 'CCC' // moment(val).local(true).format('YYYY-MM-DD')
      } else {
        return ''
      }
    },
    currentDate () {
      return DateTime.local().toISODate()
    },
  }
})

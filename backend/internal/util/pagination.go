package util

import (
	"net/http"
	"strconv"
)

const (
	DefaultPage  = 1
	DefaultLimit = 10
	MaxLimit     = 100
)

// ParsePagination mengambil parameter "page" dan "limit" dari query string,
// dengan validasi dan nilai default yang aman.
func ParsePagination(r *http.Request) (page, limit, offset int) {
	page = DefaultPage
	limit = DefaultLimit

	if v := r.URL.Query().Get("page"); v != "" {
		if p, err := strconv.Atoi(v); err == nil && p > 0 {
			page = p
		}
	}

	if v := r.URL.Query().Get("limit"); v != "" {
		if l, err := strconv.Atoi(v); err == nil && l > 0 {
			limit = l
		}
	}

	if limit > MaxLimit {
		limit = MaxLimit
	}

	offset = (page - 1) * limit
	return page, limit, offset
}

// TotalPages menghitung jumlah halaman dari total item dan limit per halaman.
func TotalPages(totalItems int64, limit int) int {
	if limit <= 0 {
		return 0
	}
	pages := int(totalItems) / limit
	if int(totalItems)%limit != 0 {
		pages++
	}
	return pages
}

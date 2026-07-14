package repository

import "strconv"

// itoa adalah shortcut kecil untuk konversi int ke string saat menyusun
// placeholder query SQL dinamis ($1, $2, dst).
func itoa(i int) string {
	return strconv.Itoa(i)
}

package util

import (
	"regexp"
	"strings"
)

var (
	slugInvalidChars = regexp.MustCompile(`[^a-z0-9]+`)
	slugTrimDash     = regexp.MustCompile(`^-+|-+$`)
)

// Slugify mengubah string bebas menjadi slug URL-friendly, contoh:
// "Gotong Royong Bersih!" -> "gotong-royong-bersih".
func Slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = slugInvalidChars.ReplaceAllString(s, "-")
	s = slugTrimDash.ReplaceAllString(s, "")
	return s
}

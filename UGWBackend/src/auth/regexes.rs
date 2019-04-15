use regex::Regex;

pub fn is_valid_name(fullname: &String) -> bool {
    // when you change these, also change it in the frontend
    let re = Regex::new(r"^[A-ZÜÄÖ][a-züäöß]+ [A-ZÜÄÖ][a-züäöß]+$").unwrap();
    return re.is_match(fullname);
}

pub fn is_valid_email(email: &String) -> bool {
    // /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    let re = Regex::new(r"^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$").unwrap();
    return re.is_match(email);
}



#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_is_valid_name() {
        let names = [ // when you change these, also change it in the frontend tests
            ("Some Name", true),
            ("SomeName", false),
            ("some name", false),
            ("Äößsad Öjasndü", true),
            ("Äö4ßsad Ö1jasndü", false)
        ];

        for (name, b) in names.iter() {
            assert_eq!(is_valid_name(&name.to_owned().to_string()), b.to_owned());
        }
    }
    #[test]
    fn test_is_valid_email() {
        // randomlists.com
        assert_eq!(is_valid_email(&"giafly@me.com".to_string()), true);
        assert_eq!(is_valid_email(&"mddallara@sbcglobal.net".to_string()), true);
        assert_eq!(is_valid_email(&"jigsaw@comcast.net".to_string()), true);
        assert_eq!(is_valid_email(&"keutzer@comcast.net".to_string()), true);
        assert_eq!(is_valid_email(&"ahuillet@msn.com".to_string()), true);
        assert_eq!(is_valid_email(&"csilvers@sbcglobal.net".to_string()), true);
        assert_eq!(is_valid_email(&"raides@yahoo.ca".to_string()), true);
        assert_eq!(is_valid_email(&"glenz@verizon.net".to_string()), true);
        assert_eq!(is_valid_email(&"specprog@att.net".to_string()), true);
        assert_eq!(is_valid_email(&"mavilar@att.net".to_string()), true);
        assert_eq!(is_valid_email(&"ghaviv@outlook.com".to_string()), true);
        assert_eq!(is_valid_email(&"#@%^%#$@#$@#.com".to_string()), false);
        assert_eq!(is_valid_email(&"examplecom".to_string()), false);
        assert_eq!(is_valid_email(&"@example.com".to_string()), false);
        assert_eq!(is_valid_email(&"Joe Smith <email@example.com>".to_string()), false);
        assert_eq!(is_valid_email(&"email.example.com".to_string()), false);
        assert_eq!(is_valid_email(&"email@example@example.com".to_string()), false);
    
    }

}



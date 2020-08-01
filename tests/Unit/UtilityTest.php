<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Helper;

class UtilityTest extends TestCase
{
    /**
     * @test
     */
    public function it_gives_correct_content_length()
    {
        $header1 = [
          'Content-Length' => 1234
        ];
        $header2 = [
          'Content-Length' => [
            1234,
            5678
          ]
        ];

        $this->assertEquals(Helper::getUrlContentLength($header1), 1234);
        $this->assertEquals(Helper::getUrlContentLength($header2), 5678);
    }

    /**
     * @test
     */
    public function it_tests_content_type_correctly()
    {
        $header1 = [
          'Content-Type' => 'video/mp4'
        ];
        $header2 = [
          'Content-Type' => [
            'text/html',
            'video/ogg'
          ]
        ];
        $header3 = [
          'Content-Type' => [
            'text/html',
            'image/png'
          ]
        ];

        $this->assertTrue(Helper::validVideo($header1));
        $this->assertTrue(Helper::validVideo($header2));
        $this->assertFalse(Helper::validVideo($header3));
    }

    /**
     * @test
     */
    public function it_gets_tags_from_strings()
    {
        $str1 = "hello# #world";
        $str2 = "this is just shit #youdigg#";
        $str3 = "stfu bitch #shutup #bitch";
        $str4 = "no hashtag";
        $str5 = "#hash1#hash2";
        $str6 = "#";

        $str7 = "hello@ @west";
        $str8 = "this is just shit @john#";
        $str9 = "stfu bitch @douglas #sh";
        $str10 = "no hashtag but @kodejuice@chima is mentioned";

        $this->assertEquals(Helper::getHashTags($str1), ['world']);
        $this->assertEquals(Helper::getHashTags($str2), ['youdigg']);
        $this->assertEquals(Helper::getHashTags($str3), ['shutup', 'bitch']);
        $this->assertEquals(Helper::getHashTags($str4), []);
        $this->assertEquals(Helper::getHashTags($str5), ['hash1', 'hash2']);
        $this->assertEquals(Helper::getHashTags($str6), []);

        $this->assertEquals(Helper::getMentions($str7), ['west']);
        $this->assertEquals(Helper::getMentions($str8), ['john']);
        $this->assertEquals(Helper::getMentions($str9), ['douglas']);
        $this->assertEquals(Helper::getMentions($str10), ['kodejuice', 'chima']);
    }
}

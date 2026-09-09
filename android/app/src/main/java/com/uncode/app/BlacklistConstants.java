package com.uncode.app;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Hardcoded blacklist of distracting applications.
 * Strictly prohibited from being whitelisted during system lockdown.
 */
public final class BlacklistConstants {

    private BlacklistConstants() {}

    public static final Set<String> HARDCODED_BLACKLISTED_PACKAGES = new HashSet<>(Arrays.asList(
        // ── Social Media & Short-Form Video ──
        "com.zhiliaoapp.musically",            // TikTok (Global)
        "com.ss.android.ugc.trill",            // TikTok (Asia / Alternative)
        "com.instagram.android",               // Instagram
        "com.instagram.lite",                  // Instagram Lite
        "com.instagram.barcelona",             // Threads
        "com.google.android.youtube",          // YouTube Main App
        "com.google.android.apps.youtube.kids",// YouTube Kids
        "com.snapchat.android",                // Snapchat
        "com.facebook.katana",                 // Facebook
        "com.facebook.lite",                   // Facebook Lite
        "com.twitter.android",                 // X / Twitter
        "com.twitter.android.lite",            // X / Twitter Lite
        "com.reddit.frontpage",                // Reddit
        "com.pinterest",                       // Pinterest
        "com.tumblr",                          // Tumblr
        "com.bereal.ft",                       // BeReal

        // ── Video Streaming & Entertainment ──
        "com.netflix.mediaclient",             // Netflix
        "com.netflix.ninja",                   // Netflix Android TV
        "com.disney.disneyplus",               // Disney+
        "tv.twitch.android.app",               // Twitch
        "com.amazon.avod.thirdpartyclient",    // Prime Video
        "com.hulu.plus",                       // Hulu
        "com.wbd.stream",                      // Max (HBO)
        "com.hbo.hbonow",                      // HBO Now
        "tv.danmaku.bili",                     // Bilibili
        "com.bilibili.app.in",                 // Bilibili Global
        "com.crunchyroll.crunchyroid",         // Crunchyroll
        "com.kick.app",                        // Kick Streaming

        // ── Gaming & Platforms ──
        "com.roblox.client",                   // Roblox
        "com.discord",                         // Discord
        "com.valvesoftware.android.steam.community", // Steam
        "com.mihoyo.genshinimpact",            // Genshin Impact
        "com.cognosphere.genshinimpact.oversea", // Genshin Impact Global
        "com.hoyoverse.hkrpgoversea",           // Honkai: Star Rail
        "com.tencent.ig",                      // PUBG Mobile
        "com.pubg.krmobile",                   // PUBG Mobile KR
        "com.pubg.imobile",                    // BGMI
        "com.dts.freefireth",                  // Free Fire
        "com.dts.freefiremax",                 // Free Fire Max
        "com.activision.callofduty.shooter",   // Call of Duty: Mobile
        "com.mobile.legends",                  // Mobile Legends: Bang Bang
        "com.supercell.brawlstars",            // Brawl Stars
        "com.supercell.clashofclans",          // Clash of Clans
        "com.supercell.clashroyale",           // Clash Royale
        "com.king.candycrushsaga",             // Candy Crush Saga
        "com.kiloo.subwaysurf",                // Subway Surfers
        "com.mojang.minecraftpe",              // Minecraft
        "com.taptap",                          // TapTap
        "com.taptap.global",                   // TapTap Global
        "com.epicgames.portal",                // Epic Games Store

        // ── Shopping & E-Commerce ──
        "com.shopee.ph",                       // Shopee PH
        "com.shopee.id",                       // Shopee ID
        "com.shopee.my",                       // Shopee MY
        "com.shopee.sg",                       // Shopee SG
        "com.shopee.th",                       // Shopee TH
        "com.shopee.vn",                       // Shopee VN
        "com.lazada.android",                  // Lazada
        "com.amazon.mshop.android.shopping",   // Amazon Shopping
        "com.zzkko",                           // Shein
        "com.einnovation.temu",                // Temu
        "com.alibaba.aliexpresshd"             // AliExpress
    ));

    public static boolean isBlacklisted(String packageName) {
        if (packageName == null) return false;
        return HARDCODED_BLACKLISTED_PACKAGES.contains(packageName.trim().toLowerCase());
    }
}

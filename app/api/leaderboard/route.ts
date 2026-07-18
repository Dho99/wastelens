import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Query parameters
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "weekly";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    // Retrieve logged in user info if session exists
    let userXp = 1450;
    let userRank = 12;
    const userBadge = "Pelopor Hijau";
    let userNama = "Ahmad Hidayat";
    let userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    if (session?.user) {
      userNama = session.user.nama || session.user.name || "Ahmad Hidayat";
      userAvatar = session.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
      
      // Look up dynamic coins from DB to make XP feel alive
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { saldo_koin: true }
      });
      if (dbUser) {
        userXp = dbUser.saldo_koin * 10 + 1000; // dynamic calculation
      }
    }

    // Dynamic mock datasets based on periods
    let top3 = [];
    let listPool = [];

    if (period === "weekly") {
      top3 = [
        {
          rank: 1,
          nama: "Budi Pratama",
          xp: 3120,
          badge: "Master Daur Ulang",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          rankChange: 0,
        },
        {
          rank: 2,
          nama: "Siti N.",
          xp: 2450,
          badge: "Pahlawan Lingkungan",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          rankChange: 0,
        },
        {
          rank: 3,
          nama: "Andi Wijaya",
          xp: 2180,
          badge: "Pelopor Hijau",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          rankChange: 0,
        },
      ];

      // Pool for items from rank 4 onwards
      listPool = [
        { rank: 4, nama: "Dewi Sartika", xp: 1890, badge: "Pahlawan Lingkungan", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80", rankChange: 2 },
        { rank: 5, nama: "Rian Pratama", xp: 1750, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", rankChange: 0 },
        { rank: 6, nama: "Maya Indah", xp: 1620, badge: "Pecinta Alam", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", rankChange: -1 },
        { rank: 7, nama: "Hendra Kusuma", xp: 1540, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", rankChange: 3 },
        { rank: 8, nama: "Fahri R.", xp: 1480, badge: "Pecinta Alam", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", rankChange: -1 },
        { rank: 9, nama: "Citra Kirana", xp: 1460, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", rankChange: 0 },
        { rank: 10, nama: "Doni S.", xp: 1410, badge: "Pecinta Alam", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80", rankChange: 1 },
        { rank: 11, nama: "Eka Putri", xp: 1390, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80", rankChange: -2 },
        { rank: 12, nama: userNama, xp: userXp, badge: userBadge, avatar: userAvatar, rankChange: 0 },
        { rank: 13, nama: "Gani K.", xp: 1210, badge: "Pecinta Alam", avatar: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150&auto=format&fit=crop&q=80", rankChange: 4 },
        { rank: 14, nama: "Hanny L.", xp: 1150, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80", rankChange: -1 },
        { rank: 15, nama: "Indra P.", xp: 1110, badge: "Pecinta Alam", avatar: "https://images.unsplash.com/photo-1504257404764-5a9898c83e20?w=150&auto=format&fit=crop&q=80", rankChange: -2 }
      ];
      userRank = 12;
    } else if (period === "monthly") {
      top3 = [
        {
          rank: 1,
          nama: "Siti N.",
          xp: 12450,
          badge: "Pahlawan Lingkungan",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          rankChange: 0,
        },
        {
          rank: 2,
          nama: "Budi Pratama",
          xp: 11120,
          badge: "Master Daur Ulang",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          rankChange: 0,
        },
        {
          rank: 3,
          nama: "Andi Wijaya",
          xp: 9890,
          badge: "Pelopor Hijau",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          rankChange: 0,
        },
      ];

      listPool = [
        { rank: 4, nama: "Dewi Sartika", xp: 8890, badge: "Pahlawan Lingkungan", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80", rankChange: -1 },
        { rank: 5, nama: "Hendra Kusuma", xp: 7540, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", rankChange: 4 },
        { rank: 6, nama: "Rian Pratama", xp: 7150, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", rankChange: 0 },
        { rank: 7, nama: "Maya Indah", xp: 6620, badge: "Pecinta Alam", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", rankChange: -3 },
        { rank: 8, nama: userNama, xp: userXp * 4, badge: userBadge, avatar: userAvatar, rankChange: 2 },
        { rank: 9, nama: "Fahri R.", xp: 5800, badge: "Pecinta Alam", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", rankChange: 1 },
        { rank: 10, nama: "Citra Kirana", xp: 5460, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", rankChange: -1 }
      ];
      userRank = 8;
    } else {
      // ALL TIME
      top3 = [
        {
          rank: 1,
          nama: "Andi Wijaya",
          xp: 45200,
          badge: "Pelopor Hijau",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          rankChange: 0,
        },
        {
          rank: 2,
          nama: "Budi Pratama",
          xp: 42120,
          badge: "Master Daur Ulang",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          rankChange: 0,
        },
        {
          rank: 3,
          nama: "Siti N.",
          xp: 39450,
          badge: "Pahlawan Lingkungan",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          rankChange: 0,
        },
      ];

      listPool = [
        { rank: 4, nama: "Rian Pratama", xp: 33150, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", rankChange: 1 },
        { rank: 5, nama: "Dewi Sartika", xp: 31890, badge: "Pahlawan Lingkungan", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80", rankChange: -1 },
        { rank: 6, nama: "Maya Indah", xp: 28620, badge: "Pecinta Alam", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", rankChange: 2 },
        { rank: 7, nama: "Hendra Kusuma", xp: 27540, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", rankChange: -2 },
        { rank: 8, nama: "Fahri R.", xp: 25800, badge: "Pecinta Alam", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", rankChange: 0 },
        { rank: 9, nama: "Citra Kirana", xp: 24600, badge: "Pelopor Hijau", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", rankChange: 1 },
        { rank: 10, nama: userNama, xp: userXp * 15, badge: userBadge, avatar: userAvatar, rankChange: -1 }
      ];
      userRank = 10;
    }

    // Pagination logic
    const total = listPool.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedList = listPool.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    // Current user rank details mapping
    const currentUser = {
      rank: userRank,
      nama: userNama,
      xp: period === "weekly" ? userXp : period === "monthly" ? userXp * 4 : userXp * 15,
      badge: userBadge,
      avatar: userAvatar,
      rankChange: 0,
    };

    return NextResponse.json(
      {
        currentUser,
        top3,
        list: paginatedList,
        pagination: {
          total,
          page,
          limit,
          hasMore,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 }
    );
  }
}

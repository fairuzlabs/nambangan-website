import { Users, MapPin, Target } from "lucide-react";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function About() {
  const visionMission = {
    vision: "Mewujudkan RW 18 Nambangan sebagai lingkungan yang bersih, sehat, sejahtera, dan peduli terhadap kelestarian lingkungan.",
    missions: [
      "Meningkatkan kesadaran warga dalam menjaga kebersihan dan kelestarian lingkungan",
      "Mengembangkan ekonomi kreatif melalui pemberdayaan UMKM lokal",
      "Menjalankan program adaptasi dan mitigasi perubahan iklim secara berkelanjutan",
      "Meningkatkan kualitas hidup warga melalui berbagai kegiatan sosial dan kemasyarakatan",
      "Membangun sistem informasi digital yang transparan dan mudah diakses oleh seluruh warga"
    ]
  };

  let members: any[] = [];
  try {
    members = await api.getOrganizationMembers();
  } catch (err) {
    console.error("Gagal memuat struktur organisasi:", err);
  }

  const order = ["Ketua RW", "Ketua Proklim", "Ketua Karang Taruna"];
  const structure = order.map(pos => {
    const found = members.find(m => m.position === pos);
    return {
      position: pos,
      name: found ? found.name : "-"
    };
  });

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tentang RW 18 Nambangan
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            RW 18 Nambangan Rejowinangun Utara adalah salah satu rukun warga di Kota Magelang 
            yang berkomitmen untuk membangun lingkungan yang bersih, sehat, dan sejahtera.
          </p>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="flex items-start gap-3 mb-6">
            <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Wilayah</h2>
              <div className="space-y-3 text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Nama RW</div>
                    <div className="font-medium">RW 18 Nambangan</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Kelurahan</div>
                    <div className="font-medium">Rejowinangun Utara</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Kecamatan</div>
                    <div className="font-medium">Magelang Selatan</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Kota</div>
                    <div className="font-medium">Magelang, Jawa Tengah</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="flex items-start gap-3 mb-6">
            <Target className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Visi & Misi</h2>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Visi</h3>
                <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  {visionMission.vision}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Misi</h3>
                <ol className="space-y-3">
                  {visionMission.missions.map((mission, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 flex-1">{mission}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>


        {/* Organization Structure */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex items-start gap-3 mb-6">
            <Users className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Struktur Organisasi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {structure.map((person, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">{person.position}</div>
                    <div className="font-semibold text-gray-900">{person.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

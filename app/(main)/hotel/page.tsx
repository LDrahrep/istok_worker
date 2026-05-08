import { getServerLang, t } from "@/lib/i18n";
import { TopBar } from "@/components/TopBar";

export default async function HotelPage() {
  const lang = await getServerLang();
  return (
    <div>
      <TopBar title={t("tab_hotel", lang)} />
      <div className="px-6 py-4">
        <p className="text-sm text-muted">
          Module 9 fills this in (HotelImageView, roommates, address).
        </p>
      </div>
    </div>
  );
}

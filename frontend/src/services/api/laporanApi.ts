import apiClient from '@/services/apiClient';

export const downloadLaporanBarangCsv = async () => {
    const response = await apiClient.get('/laporan/barang', {
        responseType: 'blob', 
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('href');
    link.href = url;
    link.setAttribute('download', `Laporan_Barang_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

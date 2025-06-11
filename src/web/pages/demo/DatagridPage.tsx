import { useState, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Button } from '@progress/kendo-react-buttons';
import logger from '@/shared/utils/logger';
import { EumDataGrid, EumDataGridRef } from '@/shared/components/ui/Eum/EumDataGrid';
import { DataGridRequest, useCreateEumDataGridRequest } from '@/shared/api/dataGridApi';

export default function DatagridPage() {
    const { t } = useTranslation(['common', 'demo']);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [loading, setLoading] = useState(false);

    // EumDataGrid ref for data manipulation
    const gridRef = useRef<EumDataGridRef>(null);

    // 데이터 조작 관련 상태들
    const [currentData, setCurrentData] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // 로그인한 유저 정보를 자동으로 사용하는 요청 생성 함수 (안정화됨)
    const createRequest = useCreateEumDataGridRequest();

    // 최초 로딩 시 사용될 안정적인 요청 객체
    const initialRequest = useMemo(() =>
        createRequest('P_1010', ['ABC', 'DEF'], ['S', 'S']),
        [createRequest]
    );

    // DataGrid에 전달될 요청 상태
    const [gridRequest, setGridRequest] = useState<DataGridRequest>(initialRequest);

    const handleSearch = useCallback(() => {
        logger.info('🔍 검색 버튼 클릭 - 새로운 요청 생성:', { startDate, endDate });

        // 검색 조건에 따라 새로운 요청 생성 (로그인한 유저 ID 자동 사용)
        const newRequest = createRequest(
            'P_1010', // callId
            [
                startDate?.toISOString().split('T')[0] || '',
                endDate?.toISOString().split('T')[0] || ''
            ], // parameters
            ['S', 'S'] // parametertype
        );
        setGridRequest(newRequest);
    }, [startDate, endDate, createRequest]);

    // 에러 핸들러 (useCallback으로 참조 안정화)
    const handleError = useCallback((error: string) => {
        logger.error('DataGrid Error:', error);
        alert(`데이터 로드 오류: ${error}`);
    }, []);

    // 데이터 로드 완료 핸들러 (useCallback으로 참조 안정화)
    const handleDataLoad = useCallback((data: any[]) => {
        setCurrentData(data);
        logger.info('✅ DataGrid 데이터 로드 완료:', {
            rowCount: data.length,
            timestamp: new Date().toISOString()
        });
    }, []);

    // 데이터 변경 핸들러 (useCallback으로 참조 안정화)
    const handleDataChange = useCallback((data: any[]) => {
        setCurrentData(data);
    }, []);

    // 행 선택 변경 핸들러 (useCallback으로 참조 안정화)
    const handleRowSelectionChange = useCallback((selectedRowIndices: number[], selectedData: any[]) => {
        setSelectedRows(selectedRowIndices);
        logger.debug('📄 DatagridPage: handleRowSelectionChange 수신', {
            selectedCount: selectedData.length,
            selectedIndices: selectedRowIndices.slice(0, 10), // 최대 10개 로깅
            sampleSelectedData: selectedData.length > 0 ? selectedData[0] : '없음'
        });
    }, []);

    // keyColumns prop 안정화 (useMemo 사용)
    const keyColumns = useMemo(() => ['td', 'code'], []);

    // gridOptions prop 안정화 (useMemo 사용)
    const gridOptions = useMemo(() => ({
        height: '700px',
        showFilter: true,
        showSort: true,
        showResize: true,
        enablePaging: false,
        selectable: true,
    }), []);

    // 데이터 조작 함수들
    const handleGetData = () => {
        const data = gridRef.current?.getData();
        logger.debug('전체 데이터 조회:', data?.length, '건');
        logger.debug('전체 데이터:', data);
    };

    const handleGetFilteredData = () => {
        const data = gridRef.current?.getFilteredData();
        logger.debug('필터된 데이터 조회:', data?.length, '건');
        logger.debug('필터된 데이터:', data);
    };

    const handleGetSelectedData = () => {
        const data = gridRef.current?.getSelectedData();
        logger.debug('선택된 데이터 조회:', data?.length, '건');
        logger.debug('선택된 데이터:', data);
    };

    const handleShowSelectedKeys = () => {
        const keys = gridRef.current?.getSelectedKeys();
        if (keys && keys.length > 0) {
            logger.info('선택된 행의 키 값들:', keys.join(', '));
            console.log('선택된 행의 키 값들:', keys);
        } else {
            logger.info('선택된 행이 없습니다');
        }
    };

    const handleTestSelection = () => {
        // 첫 번째 행을 프로그래밍 방식으로 선택
        gridRef.current?.selectRows([0]);
        logger.info('프로그래밍 방식으로 첫 번째 행 선택 시도');
    };

    const handleRefreshData = () => {
        gridRef.current?.refreshData();
        logger.info('React Query 데이터 새로고침 시작 (refetch)');
    };

    const handleClearFilters = () => {
        gridRef.current?.clearFilters();
        logger.info('필터 초기화 완료');
    };

    const handleClearSort = () => {
        gridRef.current?.clearSort();
        logger.info('정렬 초기화 완료');
    };

    const handleResetState = () => {
        gridRef.current?.resetState();
        logger.info('그리드 상태 초기화 완료');
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">
                {t('demo:dataGridPage.title')} (React Query DataGrid)
            </h1>
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-sm text-blue-700">
                    <strong>🔄 React Query 적용:</strong> 자동 중복 요청 제거, 1초 단기 캐싱으로 성능 최적화,
                    StrictMode 완벽 호환으로 개발 환경에서도 안정적으로 작동합니다.
                </p>
            </div>

            {/* 상단 검색 영역 */}
            <div className="mb-6 p-4 border rounded-md bg-gray-50">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="startDate" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-16">
                            {t('common:common.startDate')}:
                        </label>
                        <DatePicker
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.value)}
                            format="yyyy-MM-dd"
                            className="w-40"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="endDate" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-16">
                            {t('common:common.endDate')}:
                        </label>
                        <DatePicker
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.value)}
                            format="yyyy-MM-dd"
                            min={startDate || undefined}
                            className="w-40"
                        />
                    </div>
                    <Button themeColor="primary" onClick={handleSearch}>
                        {t('common:common.search')}
                    </Button>
                </div>
            </div>

            {/* 데이터 조작 컨트롤 패널 */}
            <div className="mb-6 p-4 border rounded-md bg-blue-50">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">React Query DataGrid 기능 테스트</h3>

                {/* 데이터 조회 버튼들 */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">데이터 조회</h4>
                    <div className="flex flex-wrap gap-2">
                        <Button size="small" themeColor="info" onClick={handleGetData}>
                            전체 데이터 조회
                        </Button>
                        <Button size="small" themeColor="info" onClick={handleGetFilteredData}>
                            필터된 데이터 조회
                        </Button>
                        <Button size="small" themeColor="info" onClick={handleGetSelectedData}>
                            선택된 데이터 조회
                        </Button>

                    </div>
                </div>

                {/* 데이터 변경 버튼들 */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">행 선택 제어</h4>
                    <div className="flex flex-wrap gap-2">
                        <Button size="small" themeColor="primary" onClick={() => gridRef.current?.selectAll()}>
                            전체 선택
                        </Button>
                        <Button size="small" onClick={() => gridRef.current?.unselectAll()}>
                            선택 해제
                        </Button>
                        <Button size="small" themeColor="info" onClick={handleShowSelectedKeys}>
                            선택된 키 보기
                        </Button>
                        <Button size="small" themeColor="warning" onClick={handleTestSelection}>
                            프로그래밍 선택 테스트
                        </Button>
                    </div>
                </div>

                {/* 그리드 상태 제어 버튼들 */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">그리드 상태 제어</h4>
                    <div className="flex flex-wrap gap-2">
                        <Button size="small" onClick={handleClearFilters}>
                            필터 초기화
                        </Button>
                        <Button size="small" onClick={handleClearSort}>
                            정렬 초기화
                        </Button>
                        <Button size="small" onClick={handleResetState}>
                            전체 상태 초기화
                        </Button>
                        <Button size="small" themeColor="secondary" onClick={handleRefreshData}>
                            React Query 새로고침
                        </Button>
                    </div>
                </div>

                {/* 현재 상태 정보 */}
                <div className="bg-white p-3 rounded border">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">현재 상태</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                        <div>전체 데이터: {currentData.length}건</div>
                        <div>선택된 행: {selectedRows.length}개 {selectedRows.length > 0 && `(인덱스: ${selectedRows.join(', ')})`}</div>
                        <div>키 컬럼: ['td', 'code'] (대소문자 구분 없음)</div>

                        {/* 컬럼명 정보 표시 */}
                        {currentData.length > 0 && (
                            <div className="mt-2 p-2 bg-gray-50 rounded border">
                                <div className="text-xs font-medium text-gray-700 mb-1">
                                    📋 사용 가능한 컬럼명 ({Object.keys(currentData[0]).filter(key => !key.startsWith('__')).length}개):
                                </div>
                                <div className="text-xs text-blue-700 font-mono">
                                    {Object.keys(currentData[0]).filter(key => !key.startsWith('__')).join(', ')}
                                </div>

                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* 커스텀 DataGrid */}
            <div className="border rounded-md shadow-sm overflow-hidden">
                <EumDataGrid
                    ref={gridRef}
                    request={gridRequest}
                    loading={loading}
                    onLoadingChange={setLoading}
                    onError={handleError}
                    onDataLoad={handleDataLoad}
                    onDataChange={handleDataChange}
                    onRowSelectionChange={handleRowSelectionChange}

                    // 행 선택 및 키 설정
                    keyColumns={keyColumns}
                    gridOptions={gridOptions}
                />
            </div>
        </div>
    );
}

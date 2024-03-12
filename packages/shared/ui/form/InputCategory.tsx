import {Form, Select} from 'antd';
import React from 'react';
import useTrans from '~/shared/hooks/useTrans';
import {api} from '~/utils/api';

type Props = {
    fieldName?: string;
    label?: string;
};
export default function InputCategory({ fieldName, label }: Props) {
    const { data: category, isLoading } = api.category.search.useQuery();
    const { trans } = useTrans()

    return (
        <Form.Item
            name={fieldName}
            label={label}
            rules={[{ required: true, message: trans.common.form.require }]}
            className='col-span-3 lg:col-span-1'
        >
            <Select
                placeholder={'Lựa chọn danh mục sản phẩm'}
                optionFilterProp={'label'}
                loading={isLoading}
                options={category?.data.map(item => ({ value: item.id, label: item.title }))}
                showSearch
                mode='multiple'
            />
        </Form.Item>
    );
}
